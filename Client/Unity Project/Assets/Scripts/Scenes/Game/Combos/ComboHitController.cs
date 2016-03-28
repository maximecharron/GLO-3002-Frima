using UnityEngine;
using System.Collections;
using Assets.Scripts.Utils.UnityObjectPool;
using System.Collections.Generic;
using Assets.Scripts.Extensions;

namespace Assets.Scripts.Scenes.Game.Combos
{
    public class ComboHitController : MonoBehaviour
    {

        //Configurable script parameters
        public BossController BossController;
        public GameObject ComboHitZone;
        public int ComboHitZonePoolSize = 3;
        public GameObject ComboBonusBubble;
        public int ComboBonusBubblePoolSize = 3;

        private List<ComboHitSequence> hitSequences = new List<ComboHitSequence>();
        private ComboHitSequenceController hitSequenceController;

        void Start()
        {
            this.ComboHitZone.SetActive(false);
            this.ComboBonusBubble.SetActive(false);
            CreateHitSequences();
            InitSequenceController();
        }

        private void InitSequenceController()
        {
            UnityObjectPool hitZonePool = new UnityObjectPool(ComboHitZone, ComboHitZonePoolSize);
            hitZonePool.OnCheckIsAvailable = IsComboHitZonePoolItemAvailableCallback;
            UnityObjectPool bonusBubblePool = new UnityObjectPool(ComboBonusBubble, ComboBonusBubblePoolSize);
            bonusBubblePool.OnCheckIsAvailable = IsComboBonusBubblePoolItemAvailableCallback;
            this.hitSequenceController = new ComboHitSequenceController(hitZonePool, bonusBubblePool);
            this.hitSequenceController.OnHitZoneClicked = OnHitZoneClickedCallback;
            this.hitSequenceController.OnSequenceAchieved = OnSequenceAchievedCallback;
        }

        private bool IsComboHitZonePoolItemAvailableCallback(UnityEngine.Object unityObject)
        {
            ComboHitZoneController comboHitZoneController = ((GameObject)unityObject).GetComponent<ComboHitZoneController>();
            return !comboHitZoneController.Active;
        }

        private bool IsComboBonusBubblePoolItemAvailableCallback(UnityEngine.Object unityObject)
        {
            ComboBonusBubbleController comboBonusBubbleController = ((GameObject)unityObject).GetComponent<ComboBonusBubbleController>();
            return !comboBonusBubbleController.Active;
        }

        private void CreateHitSequences()
        {
            ComboHitSequence hitSequence1 = new ComboHitSequence(1, 2f, 1f, 0.25f, 2);
            hitSequence1.TriggerZone = new Rect(-0.5f, 0f, 1f, 0.5f);
            hitSequence1.HitZones = new List<Vector2>() { new Vector2(-0.1f, 0), new Vector2(0.1f, 0) };
            hitSequences.Add(hitSequence1);
        }

        void Update()
        {
            if (hitSequenceController.IsActive)
            {
                hitSequenceController.Update();
            }
        }

        public void OnMouseDown()
        {
            if (!hitSequenceController.IsActive)
            {
                Vector2 mousePosition = BossController.gameObject.GetMousePosition();
                List<ComboHitSequence> eligibleComboHitSeqences = TryGetNextComboHitSequence(mousePosition);
                if (eligibleComboHitSeqences.Count > 0)
                {
                    ComboHitSequence hitSequence = eligibleComboHitSeqences.RandomItem();
                    hitSequenceController.ShowSequence(hitSequence);
                }
            }
        }

        public List<ComboHitSequence> TryGetNextComboHitSequence(Vector2 hitPosition)
        {
            List<ComboHitSequence> eligibleComboHitSequences = new List<ComboHitSequence>();
            foreach (ComboHitSequence comboHitSequence in hitSequences)
            {
                if (comboHitSequence.IsActivable(hitPosition))
                {
                    eligibleComboHitSequences.Add(comboHitSequence);
                }
            }
            return eligibleComboHitSequences;
        }

        private void OnHitZoneClickedCallback(ComboHitZoneController hitZoneController)
        {
            BossController.OnMouseDown();
        }

        private void OnSequenceAchievedCallback(ComboHitSequence hitSequence)
        {
            BossController.RemoveBossLife(BossController.DEFAULT_ATTACK_VALUE * hitSequence.BonusMultiplier);
            BossController.KnockOut();
        }
    }
}