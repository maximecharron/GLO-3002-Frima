using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using Assets.Scripts.SpriteAnimation;
using Assets.Scripts.CharacterControl;
using UnityEngine.UI;
using Assets.Scripts.Communication;
using Assets.Scripts.Communication.CommandDTOs;
using Assets.Scripts.Extensions;
using System;
using Assets.Scripts.Scenes.Game;
using Assets.Scripts.Utils;
using Assets.Scripts.Scenes.Game.Stamina;
using Assets.Scripts.Scenes.Game.Hype;

namespace Assets.Scripts.Scenes.Game.Boss
{

    public class BossController : MonoBehaviour
    {
        public const int DEFAULT_ATTACK_VALUE = 1000;
        public const int HYPE_ATTACK_VALUE = Int32.MaxValue;
        private const int HIT_MISS_STATE_PRIORITY = 1;
        private const int HIT_MISS_STATE_ANIMATION_PRIORITY = 1;
        private const int HYPE_HIT_STATE_PRIORITY = 2;
        private const int HYPE_HIT_STATE_ANIMATION_PRIORITY = 2;
        private const int COMBO_HIT_STATE_PRIORITY = 3;
        private const int COMBO_HIT_STATE_ANIMATION_PRIORITY = 3;
        private const int HIT_STATE_PRIORITY = 4;
        private const int HIT_STATE_ANIMATION_PRIORITY = 4;
        private const int IDLE_STATE_PRIORITY = 5;
        private const int IDLE_STATE_ANIMATION_PRIORITY = 5;

        //Configurable script parameters
        public int SpritesheetColumnCount = 8;
        public BossHitFeedbackController BossHitFeedbackController;
        public StaminaController StaminaController;
        public HypeController HypeController;
        public HealthPointSliderController HealthPointSliderController;
        public AudioClip KnockOutFallAudioClip;
        public AudioClip KnockOutVoiceAudioClip;

        public delegate void BossDeadEventHandler();
        public event BossDeadEventHandler OnBossDead;
        public delegate void BossCreationDateUpdateEventHandler(DateTime creationDate);
        public event BossCreationDateUpdateEventHandler OnBossCreationDateUpdate;

        private CharacterStateController bossStateController;
        private CharacterState idleState;
        private CharacterState hitState;
        private CharacterState comboHitState;
        private CharacterState hitMissState;
        private CharacterState hypeHitState;
        private SpriteAnimationSequence idleSequence1 = new SpriteAnimationSequence(new List<int> { 0, 1 }, 5, 3);
        private SpriteAnimationSequence idleSequence2 = new SpriteAnimationSequence(new List<int> { 2, 3 }, 5, 3);
        private SpriteAnimationSequence hitSequence1 = new SpriteAnimationSequence(new List<int> { 18 }, 2, 1);
        private SpriteAnimationSequence hitSequence2 = new SpriteAnimationSequence(new List<int> { 22 }, 2, 1);
        private SpriteAnimationSequence hitSequence3 = new SpriteAnimationSequence(new List<int> { 24 }, 2, 1);
        private SpriteAnimationSequence comboHitSequence1 = new SpriteAnimationSequence(new List<int> { 26, 28, 30, 31 }, 5, 1);
        private SpriteAnimationSequence comboHitSequence2 = new SpriteAnimationSequence(new List<int> { 23, 27, 29, 30, 31 }, 5, 1);
        private SpriteAnimationSequence hitMissSequence = new SpriteAnimationSequence(new List<int> { 16 }, 2, 1);
        private SpriteAnimationSequence hypeHitSequence = new SpriteAnimationSequence(new List<int> { 20, 37 }, 2, 5);

        private WebSocketService webSocketService;
        private int currentBossLife = 0;

        void Start()
        {
            InitializeStateController();
            InitializeStates();
            AssignStateActions();
            HypeController.OnHypeAttack = OnHypeAttackCallback;
            webSocketService = FindObjectOfType<WebSocketService>();
        }

        private void InitializeStateController()
        {
            SpriteAnimator spriteAnimator = new SpriteAnimator(GetComponent<Renderer>().material, SpritesheetColumnCount);
            CharacterAnimationController animationController = new CharacterAnimationController(spriteAnimator);
            bossStateController = new CharacterStateController(animationController);
        }

        private void InitializeStates()
        {
            SpriteAnimationSettings missStateAnimationSettings = new SpriteAnimationSettings(true);
            hitMissState = new CharacterState("Hit Miss", HIT_MISS_STATE_PRIORITY, HIT_MISS_STATE_ANIMATION_PRIORITY, missStateAnimationSettings);
            hitMissState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { hitMissSequence };

            SpriteAnimationSettings hitStateAnimationSettings = new SpriteAnimationSettings(true);
            hitState = new CharacterState("Hit", HIT_STATE_PRIORITY, HIT_STATE_ANIMATION_PRIORITY, hitStateAnimationSettings);
            hitState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { hitSequence1, hitSequence2, hitSequence3 };

            SpriteAnimationSettings comboHitStateAnimationSettings = new SpriteAnimationSettings(true);
            comboHitState = new CharacterState("Combo Hit", COMBO_HIT_STATE_PRIORITY, COMBO_HIT_STATE_ANIMATION_PRIORITY, comboHitStateAnimationSettings);
            comboHitState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { comboHitSequence1, comboHitSequence2 };

            SpriteAnimationSettings hypeHitStateAnimationSettings = new SpriteAnimationSettings(true);
            hypeHitState = new CharacterState("Combo Hit", HYPE_HIT_STATE_PRIORITY, HYPE_HIT_STATE_ANIMATION_PRIORITY, comboHitStateAnimationSettings);
            hypeHitState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { hypeHitSequence };

            SpriteAnimationSettings idleStateAnimationSettings = new SpriteAnimationSettings(true);
            idleState = new CharacterState("Idle", IDLE_STATE_PRIORITY, IDLE_STATE_ANIMATION_PRIORITY, idleStateAnimationSettings);
            idleState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { idleSequence1, idleSequence2 };

            bossStateController.AddState(idleState);
        }

        private void AssignStateActions()
        {
            hitState.OnActivate = OnHitStateActivateCallback;
            hitState.OnAnimationSequenceEnd = OnHitAnimationSequenceEndCallback;
            comboHitState.OnActivate = OnComboHitStateActivateCallback;
            comboHitState.OnAnimationSequenceEnd = OnComboHitAnimationSequenceEndCallback;
            hitMissState.OnActivate = OnHitMissStateActivateCallback;
            hitMissState.OnAnimationSequenceEnd = OnHitMissAnimationSequenceEndCallback;
            hypeHitState.OnAnimationSequenceEnd = OnHypeHitAnimationSequenceEndCallback;
        }

        void Update()
        {
            bossStateController.Update();
        }

        public void OnMouseDown()
        {
            OnHypeAttackCallback();
            return;
            if (StaminaController.IsHitMiss())
            {
                bossStateController.AddState(hitMissState, true);
            }
            else
            {
                bossStateController.RemoveAllStates(idleState);
                bossStateController.AddState(hitState, true);
            }
        }

        public void ComboHit()
        {
            bossStateController.RemoveAllStates(idleState);
            bossStateController.AddState(comboHitState);
        }

        private void OnHitStateActivateCallback(CharacterState sender)
        {
            RemoveBossLife(DEFAULT_ATTACK_VALUE);
            StaminaController.DecreaseStamina();
            HypeController.IncreaseHype();
            BossHitFeedbackController.Hit(DEFAULT_ATTACK_VALUE);
        }

        private void OnComboHitStateActivateCallback(CharacterState sender)
        {
            this.gameObject.FindAudioSource(KnockOutFallAudioClip).Play();
            this.gameObject.FindAudioSource(KnockOutVoiceAudioClip).Play();
        }

        public bool OnHitAnimationSequenceEndCallback(CharacterState sender)
        {
            bossStateController.RemoveState(hitState);
            return false;
        }

        public bool OnComboHitAnimationSequenceEndCallback(CharacterState sender)
        {
            bossStateController.RemoveState(comboHitState);
            return false;
        }

        private void OnHitMissStateActivateCallback(CharacterState sender)
        {
            BossHitFeedbackController.HitMiss();
        }

        public bool OnHitMissAnimationSequenceEndCallback(CharacterState sender)
        {
            bossStateController.RemoveState(hitMissState);
            return false;
        }

        public bool OnHypeHitAnimationSequenceEndCallback(CharacterState sender)
        {

            RemoveBossLife(HYPE_ATTACK_VALUE);
            return true;
        }

        public void BossStatusUpdateCallback(CommandDTO commandDTO)
        {
            var bossStatusUpateParams = ((BossStatusUpdateCommandDTO)commandDTO).command.parameters;
            OnBossCreationDateUpdate(DateTimeUtils.ConvertFromJavaScriptDate(bossStatusUpateParams.creationDate));
            if (bossStatusUpateParams.currentBossLife <= 0 || (BossStatus)bossStatusUpateParams.status == BossStatus.DEAD)
            {
                OnBossDead();
            }
            else
            {
                HealthPointSliderController.MaxValue = bossStatusUpateParams.maximumBossLife;
                UpdateBossLife(bossStatusUpateParams.currentBossLife);
            }
        }

        public void RemoveBossLife(int value)
        {
            UpdateBossLife(currentBossLife - value);
            webSocketService.SendCommand(new BossAttackCommandDTO(value));
        }

        private void UpdateBossLife(int value)
        {
            if (value > currentBossLife && value - currentBossLife <= DEFAULT_ATTACK_VALUE)
            {
                return;
            }
            else if (value < 0)
            {
                value = 0;
            }
            currentBossLife = value;
            HealthPointSliderController.Value = value;
        }

        private void OnHypeAttackCallback()
        {
            bossStateController.RemoveAllStates(idleState);
            bossStateController.AddState(hypeHitState, true);
        }
    }

}