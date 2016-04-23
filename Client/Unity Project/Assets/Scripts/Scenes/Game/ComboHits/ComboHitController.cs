using UnityEngine;
using System.Collections;
using Assets.Scripts.Utils.UnityObjectPool;
using System.Collections.Generic;
using Assets.Scripts.Extensions;
using System;
using Assets.Scripts.Scenes.Game.Boss;
using Assets.Scripts.Services.BossStatus;
using Assets.Scripts.Services.ComboHits;

namespace Assets.Scripts.Scenes.Game.ComboHits
{
    [RequireComponent(typeof(AudioSource))]
    public class ComboHitController : MonoBehaviour
    {
        private const float DELAY_BETWEEN_SEQUENCES = 5f;

        //Configurable script parameters
        public GameObject Boss;
        public GameObject ComboHitZone;
        public int ComboHitZonePoolSize;
        public GameObject ComboBonusBubble;
        public int ComboBonusBubblePoolSize;
        public GameObject HitFeedbackBubble;
        public int HitFeedbackBubblePoolSize;
        public AudioClip SequenceAchievedAudioClip;

        public delegate void ComboHitCompletedEventHandler(ComboHitSequence comboHitSequence);
        public event ComboHitCompletedEventHandler OnComboHitSequenceCompleted = delegate { };

        private BossStatusService bossStatusService;
        private ComboHitService comboHitService;
        private ComboHitSequenceController hitSequenceController;
        private ComboHitSequence randomHitSequence;
        private float lastSequenceTime;
        private new bool enabled = true;

        void Start()
        {
            bossStatusService = FindObjectOfType<BossStatusService>();
            bossStatusService.OnBossDead += BossDeadEventHandler;
            comboHitService = FindObjectOfType<ComboHitService>();
            ComboHitZone.SetActive(false);
            ComboBonusBubble.SetActive(false);
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
            hitSequenceController = new ComboHitSequenceController(hitZonePool, bonusBubblePool, hitFeedbackBubblePool, Boss, ComboHitZone.transform.localPosition.z);
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
                List<ComboHitSequence> eligibleComboHitSeqences = comboHitService.GetEligibleComboHitSequences(mousePosition);
                if (eligibleComboHitSeqences.Count > 0)
                {
                    ComboHitSequence hitSequence = eligibleComboHitSeqences.RandomItem();
                    hitSequenceController.ShowSequence(hitSequence);
                }
            }
        }

        private void HitZoneClickedEventHandler(ComboHitZoneController hitZoneController)
        {
            if (!hitSequenceController.HitSequence.EndOfSequence)
            {
                Boss.GetComponent<BossController>().OnMouseDown();
            }
        }

        private void SequenceAchievedCallbackEventHandler(ComboHitSequence hitSequence)
        {
            GetComponent<AudioSource>().PlayAudioClip(SequenceAchievedAudioClip);
            OnComboHitSequenceCompleted(hitSequence);
            Boss.GetComponent<BossController>().ComboHit(hitSequence.BonusMultiplier);
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