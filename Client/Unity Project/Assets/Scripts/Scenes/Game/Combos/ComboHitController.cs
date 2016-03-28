using UnityEngine;
using System.Collections;
using Assets.Scripts.Utils.UnityObjectPool;
using System.Collections.Generic;
using Assets.Scripts.Extensions;

namespace Assets.Scripts.Scenes.Game.Combos
{
    public class ComboHitController : MonoBehaviour
    {
        private static Rect DEFAULT_HIT_ZONE = new Rect(-0.16f, -0.4f, 0.32f, 0.445f);
        private const int RANDOM_HIT_ZONE_COUNT = 4;
        private const float DELAY_BETWEEN_SEQUENCES = 2f;

        //Configurable script parameters
        public BossController BossController;
        public GameObject ComboHitZone;
        public int ComboHitZonePoolSize;
        public GameObject ComboBonusBubble;
        public int ComboBonusBubblePoolSize;
        public AudioClip SequenceAchievedAudioClip;

        private List<ComboHitSequence> hitSequences = new List<ComboHitSequence>();
        private ComboHitSequenceController hitSequenceController;
        private ComboHitSequence randomHitSequence;
        private float lastSequenceTime;

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
            this.hitSequenceController.OnSequenceTerminated = OnSequenceTerminatedCallback;
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
            ComboHitSequence legsHitSequence = new ComboHitSequence(10, 2, DEFAULT_HIT_ZONE);
            legsHitSequence.HitZones = new List<Vector2>() { new Vector2(-0.092f, -0.372f), new Vector2(0.1f, -0.372f) };
            hitSequences.Add(legsHitSequence);

            ComboHitSequence pectoralsHitSequence = new ComboHitSequence(10, 2, DEFAULT_HIT_ZONE);
            pectoralsHitSequence.HitZones = new List<Vector2>() { new Vector2(-0.09f, -0.09f), new Vector2(0.111f, -0.09f) };
            hitSequences.Add(pectoralsHitSequence);

            ComboHitSequence bellyHitSequence = new ComboHitSequence(10, 3, DEFAULT_HIT_ZONE);
            bellyHitSequence.HitZones = new List<Vector2>() { new Vector2(-0.112f, -0.184f), new Vector2(0.114f, -0.184f), new Vector2(-0.112f, -0.294f), new Vector2(0.114f, -0.294f) };
            hitSequences.Add(bellyHitSequence);

            ComboHitSequence pectoralHeadCrossHitSequence = new ComboHitSequence(10, 5, DEFAULT_HIT_ZONE);
            pectoralHeadCrossHitSequence.HitZones = pectoralsHitSequence.HitZones;
            pectoralHeadCrossHitSequence.HitZones.Add(new Vector2(0.014f, 0.047f));
            hitSequences.Add(pectoralHeadCrossHitSequence);

            ComboHitSequence pectoralBellyCrossHitSequence = new ComboHitSequence(10, 10, DEFAULT_HIT_ZONE);
            pectoralHeadCrossHitSequence.HitZones = pectoralsHitSequence.HitZones;
            pectoralHeadCrossHitSequence.HitZones.AddRange(new List<Vector2>() { new Vector2(-0.112f, -0.294f), new Vector2(0.114f, -0.294f) });
            hitSequences.Add(pectoralBellyCrossHitSequence);

            randomHitSequence = new RandomizedComboHitSequence(DEFAULT_HIT_ZONE, RANDOM_HIT_ZONE_COUNT, 20, 20, DEFAULT_HIT_ZONE);
            hitSequences.Add(randomHitSequence);
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
            if (!hitSequenceController.IsActive && Time.time - lastSequenceTime >= DELAY_BETWEEN_SEQUENCES)
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
            if (!hitSequenceController.HitSequence.EndOfSequence)
            {
                BossController.OnMouseDown();
            }
        }

        private void OnSequenceAchievedCallback(ComboHitSequence hitSequence)
        {
            BossController.RemoveBossLife(BossController.DEFAULT_ATTACK_VALUE * hitSequence.BonusMultiplier);
            BossController.KnockOut();
            BossController.gameObject.FindAudioSource(SequenceAchievedAudioClip).Play();
        }

        private void OnSequenceTerminatedCallback(ComboHitSequence hitSequence)
        {
            lastSequenceTime = Time.time;
        }
    }
}