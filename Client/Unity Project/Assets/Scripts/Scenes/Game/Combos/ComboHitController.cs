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
        public int ComboHitZonePoolSize;
        public GameObject ComboBonusBubble;
        public int ComboBonusBubblePoolSize;

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
            ComboHitSequence hitSequence1 = new ComboHitSequence(5, 2); //Legs
            hitSequence1.TriggerZone = new Rect(-0.5f, 0f, 1f, 0.5f);
            hitSequence1.HitZones = new List<Vector2>() { new Vector2(-0.123f, -0.344f), new Vector2(0.116f, -0.344f) };
            hitSequences.Add(hitSequence1);

            ComboHitSequence hitSequence2 = new ComboHitSequence(1, 3); //Belly
            hitSequence2.TriggerZone = new Rect(-0.5f, 0f, 1f, 0.5f);
            hitSequence2.HitZones = new List<Vector2>() { new Vector2(-0.111f, -0.091f), new Vector2(0.134f, -0.091f), new Vector2(-0.111f, -0.23f), new Vector2(0.134f, -0.23f) };
            hitSequences.Add(hitSequence2);
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