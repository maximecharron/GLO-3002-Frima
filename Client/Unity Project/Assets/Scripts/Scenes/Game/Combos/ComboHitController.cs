using UnityEngine;
using System.Collections;
using Assets.Scripts.Utils.UnityObjectPool;
using System.Collections.Generic;
using Assets.Scripts.Extensions;
using System;
using Assets.Scripts.Scenes.Game.Boss;
using Assets.Scripts.Services.BossStatus;

namespace Assets.Scripts.Scenes.Game.Combos
{
    public class ComboHitController : MonoBehaviour
    {
        private static Rect DEFAULT_HIT_ZONE = new Rect(-0.16f, -0.4f, 0.32f, 0.445f);
        private const int RANDOM_HIT_ZONE_COUNT = 4;
        private const float DELAY_BETWEEN_SEQUENCES = 2f;

        //Configurable script parameters
        public GameObject ComboHitZone;
        public int ComboHitZonePoolSize;
        public GameObject ComboBonusBubble;
        public int ComboBonusBubblePoolSize;
        public GameObject HitFeedbackBubble;
        public int HitFeedbackBubblePoolSize;
        public AudioClip SequenceAchievedAudioClip;

        public delegate void ComboHitCompletedEventHandler(ComboHitSequence comboHitSequence);
        public event ComboHitCompletedEventHandler OnComboHitCompleted = delegate { };
        public event ComboHitZoneController.HitZoneClickedEventHandler OnHitZoneClicked = delegate { };

        private BossStatusService bossStatusService;
        private List<ComboHitSequence> hitSequences = new List<ComboHitSequence>();
        private ComboHitSequenceController hitSequenceController;
        private ComboHitSequence randomHitSequence;
        private float lastSequenceTime;
        private new bool enabled = true;

        void Start()
        {
            bossStatusService = FindObjectOfType<BossStatusService>();
            bossStatusService.OnBossDead += BossDeadEventHandler;
            ComboHitZone.SetActive(false);
            ComboBonusBubble.SetActive(false);
            CreateHitSequences();
            InitSequenceController();
        }

        void OnDestroy()
        {
            bossStatusService.OnBossDead -= BossDeadEventHandler;
        }

        private void InitSequenceController()
        {
            UnityObjectPool hitZonePool = new UnityObjectPool(ComboHitZone, ComboHitZonePoolSize, IsComboHitZonePoolItemAvailableCallback);
            UnityObjectPool bonusBubblePool = new UnityObjectPool(ComboBonusBubble, ComboBonusBubblePoolSize, IsComboBonusBubblePoolItemAvailableCallback);
            UnityObjectPool hitFeedbackBubblePool = new UnityObjectPool(HitFeedbackBubble, HitFeedbackBubblePoolSize, IsHitFeedbackBubblePoolItemAvailableCallback);
            hitSequenceController = new ComboHitSequenceController(hitZonePool, bonusBubblePool, hitFeedbackBubblePool, ComboHitZone.transform.localPosition.z);
            hitSequenceController.OnHitZoneClicked += HitZoneClickedEventHandler;
            hitSequenceController.OnSequenceAchieved += SequenceAchievedCallbackEventHandler;
            hitSequenceController.OnSequenceTerminated += SequenceTerminatedEventHandler;
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

        private bool IsHitFeedbackBubblePoolItemAvailableCallback(UnityEngine.Object unityObject)
        {
            ComboHitFeedbackBubbleController comboHitFeedbackController = ((GameObject)unityObject).GetComponent<ComboHitFeedbackBubbleController>();
            return !comboHitFeedbackController.Active;
        }

        private void CreateHitSequences()
        {
            ComboHitSequence legsHitSequence = new ComboHitSequence("Simple Legs", 10, 2, DEFAULT_HIT_ZONE);
            legsHitSequence.HitZones = new List<Vector2>() { new Vector2(-0.092f, -0.372f), new Vector2(0.1f, -0.372f) };
            hitSequences.Add(legsHitSequence);

            ComboHitSequence pectoralsHitSequence = new ComboHitSequence("Simple Pectoral", 10, 2, DEFAULT_HIT_ZONE);
            pectoralsHitSequence.HitZones = new List<Vector2>() { new Vector2(-0.09f, -0.09f), new Vector2(0.111f, -0.09f) };
            hitSequences.Add(pectoralsHitSequence);

            ComboHitSequence bellyHitSequence = new ComboHitSequence("Simple Belly", 10, 3, DEFAULT_HIT_ZONE);
            bellyHitSequence.HitZones = new List<Vector2>() { new Vector2(-0.112f, -0.184f), new Vector2(0.114f, -0.184f), new Vector2(-0.112f, -0.294f), new Vector2(0.114f, -0.294f) };
            hitSequences.Add(bellyHitSequence);

            ComboHitSequence pectoralHeadCrossHitSequence = new ComboHitSequence("Pectoral / Head Cross", 10, 5, DEFAULT_HIT_ZONE);
            pectoralHeadCrossHitSequence.HitZones = new List<Vector2>(pectoralsHitSequence.HitZones);
            pectoralHeadCrossHitSequence.HitZones.Add(new Vector2(0.014f, 0.047f));
            hitSequences.Add(pectoralHeadCrossHitSequence);

            ComboHitSequence pectoralBellyCrossHitSequence = new ComboHitSequence("Pectoral / Belly Cross", 10, 10, DEFAULT_HIT_ZONE);
            pectoralBellyCrossHitSequence.HitZones = new List<Vector2>(pectoralsHitSequence.HitZones);
            pectoralBellyCrossHitSequence.HitZones.AddRange(new List<Vector2>() { new Vector2(-0.112f, -0.294f), new Vector2(0.114f, -0.294f) });
            hitSequences.Add(pectoralBellyCrossHitSequence);

            randomHitSequence = new RandomizedComboHitSequence("Random", DEFAULT_HIT_ZONE, RANDOM_HIT_ZONE_COUNT, 20, 20, DEFAULT_HIT_ZONE);
            hitSequences.Add(randomHitSequence);
        }

        void Update()
        {
            if (enabled && hitSequenceController.IsActive)
            {
                hitSequenceController.Update();
            }
        }

        public void OnMouseDown()
        {
            if (enabled && !hitSequenceController.IsActive && Time.time - lastSequenceTime >= DELAY_BETWEEN_SEQUENCES)
            {
                Vector2 mousePosition = this.gameObject.GetMousePosition();
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

        private void HitZoneClickedEventHandler(ComboHitZoneController hitZoneController)
        {
            if (!hitSequenceController.HitSequence.EndOfSequence)
            {
                OnHitZoneClicked(hitZoneController);
            }
        }

        private void SequenceAchievedCallbackEventHandler(ComboHitSequence hitSequence)
        {
            this.gameObject.FindAudioSource(SequenceAchievedAudioClip).Play();
            OnComboHitCompleted(hitSequence);
        }

        private void SequenceTerminatedEventHandler(ComboHitSequence hitSequence)
        {
            lastSequenceTime = Time.time;
        }

        private void BossDeadEventHandler()
        {
            enabled = false;
        }
    }
}