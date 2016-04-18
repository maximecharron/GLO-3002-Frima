using UnityEngine;
using System.Collections.Generic;
using Assets.Scripts.Animation.SpriteAnimation;
using Assets.Scripts.CharacterControl;
using Assets.Scripts.Extensions;
using Assets.Scripts.Scenes.Game.Stamina;
using Assets.Scripts.Scenes.Game.Hype;
using Assets.Scripts.Services;
using Assets.Scripts.Services.BossStatus;

namespace Assets.Scripts.Scenes.Game.Boss
{

    public class BossController : MonoBehaviour
    {
        private const int KNOCK_OUT_STATE_PRIORITY = 1;
        private const int KNOCK_OUT_STATE_ANIMATION_PRIORITY = 1;
        private const int COMBO_HIT_STATE_PRIORITY = 2;
        private const int COMBO_HIT_STATE_ANIMATION_PRIORITY = 2;
        private const int HIT_MISS_STATE_PRIORITY = 3;
        private const int HIT_MISS_STATE_ANIMATION_PRIORITY = 3;
        private const int HIT_STATE_PRIORITY = 4;
        private const int HIT_STATE_ANIMATION_PRIORITY = 4;
        private const int IDLE_STATE_PRIORITY = 5;
        private const int IDLE_STATE_ANIMATION_PRIORITY = 5;

        //Configurable script parameters
        public int SpritesheetColumnCount = 8;
        public BossAttackFeedbackController BossAttackFeedbackController;
        public BossDeathController BossDeathController;
        public StaminaController StaminaController;
        public HypeController HypeController;
        public HealthPointSliderController HealthPointSliderController;
        public AudioClip KnockOutFallAudioClip;
        public AudioClip KnockOutVoiceAudioClip;

        private GameControlService gameControlService;
        private GameStatisticsService gameStatisticsService;
        private BossStatusService bossStatusService;
        private PlayerPropertyService playerPropertyService;
        private CharacterStateController bossStateController;
        private CharacterState idleState;
        private CharacterState hitState;
        private CharacterState comboHitState;
        private CharacterState hitMissState;
        private CharacterState knockOutState;
        private SpriteAnimationSequence idleSequence1 = new SpriteAnimationSequence(new List<int> { 0, 1 }, 5, 3);
        private SpriteAnimationSequence idleSequence2 = new SpriteAnimationSequence(new List<int> { 2, 3 }, 5, 3);
        private SpriteAnimationSequence hitSequence1 = new SpriteAnimationSequence(new List<int> { 18 }, 2, 1);
        private SpriteAnimationSequence hitSequence2 = new SpriteAnimationSequence(new List<int> { 22 }, 2, 1);
        private SpriteAnimationSequence hitSequence3 = new SpriteAnimationSequence(new List<int> { 24 }, 2, 1);
        private SpriteAnimationSequence comboHitSequence1 = new SpriteAnimationSequence(new List<int> { 26, 28, 30, 31 }, 5, 1);
        private SpriteAnimationSequence comboHitSequence2 = new SpriteAnimationSequence(new List<int> { 23, 27, 29, 30, 31 }, 5, 1);
        private SpriteAnimationSequence hitMissSequence = new SpriteAnimationSequence(new List<int> { 16 }, 2, 1);
        private SpriteAnimationSequence knockOutHitSequence = new SpriteAnimationSequence(new List<int> { 20, 37 }, 2, 3);

        void Start()
        {
            InitializeStateController();
            InitializeStates();
            AssignStateActions();
            HypeController.OnHypeAttack = OnHypeAttackCallback;
            gameControlService = FindObjectOfType<GameControlService>();
            gameStatisticsService = FindObjectOfType<GameStatisticsService>();
            playerPropertyService = FindObjectOfType<PlayerPropertyService>();
            bossStatusService = FindObjectOfType<BossStatusService>();
            bossStatusService.OnBossStatusUpdate += BossStatusUpdateEventHandler;
            bossStatusService.OnBossDead += BossDeadEventHandler;
            UpdateBossStatusDisplayValues();
        }

        void OnDestroy()
        {
            bossStatusService.OnBossStatusUpdate -= BossStatusUpdateEventHandler;
            bossStatusService.OnBossDead -= BossDeadEventHandler;
        }

        private void InitializeStateController()
        {
            SpriteAnimator spriteAnimator = new SpriteAnimator(GetComponent<Renderer>().material, SpritesheetColumnCount);
            CharacterAnimationController animationController = new CharacterAnimationController(spriteAnimator);
            bossStateController = new CharacterStateController(animationController);
        }

        private void InitializeStates()
        {
            SpriteAnimationSettings defaultAnimationSettings = new SpriteAnimationSettings(true);

            hitMissState = new CharacterState("Hit Miss", HIT_MISS_STATE_PRIORITY, HIT_MISS_STATE_ANIMATION_PRIORITY, defaultAnimationSettings);
            hitMissState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { hitMissSequence };
            hitState = new CharacterState("Hit", HIT_STATE_PRIORITY, HIT_STATE_ANIMATION_PRIORITY, defaultAnimationSettings);
            hitState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { hitSequence1, hitSequence2, hitSequence3 };
            comboHitState = new CharacterState("Combo Hit", COMBO_HIT_STATE_PRIORITY, COMBO_HIT_STATE_ANIMATION_PRIORITY, defaultAnimationSettings);
            comboHitState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { comboHitSequence1, comboHitSequence2 };
            comboHitState.AddIncompatibleStates(new CharacterState[] { hitState });
            knockOutState = new CharacterState("Knock Out", KNOCK_OUT_STATE_PRIORITY, KNOCK_OUT_STATE_ANIMATION_PRIORITY, defaultAnimationSettings);
            knockOutState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { knockOutHitSequence };
            knockOutState.AddIncompatibleStates(new CharacterState[] { hitMissState, hitState, comboHitState });
            idleState = new CharacterState("Idle", IDLE_STATE_PRIORITY, IDLE_STATE_ANIMATION_PRIORITY, defaultAnimationSettings);
            idleState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { idleSequence1, idleSequence2 };
            bossStateController.AddState(idleState);
        }

        private void AssignStateActions()
        {
            hitState.OnActivate += HitStateActivateEventHandler;
            hitState.OnAnimationSequenceComplete += HitAnimationSequenceCompleteEventHandler;
            comboHitState.OnActivate += ComboHitStateActivateEventHandler;
            comboHitState.OnAnimationSequenceComplete += ComboHitAnimationSequenceCompleteEventHandler;
            hitMissState.OnActivate += HitMissStateActivateEventHandler;
            hitMissState.OnAnimationSequenceComplete += HitMissAnimationSequenceCompleteEventHandler;
            knockOutState.OnActivate += KnockOutStateActivateEventHandler;
            knockOutState.OnAnimationSequenceComplete += OnKnockOutAnimationSequenceEndCallback;
        }

        void Update()
        {
            bossStateController.Update();
        }

        public void OnMouseDown()
        {
            if (StaminaController.IsHitMiss())
            {
                bossStateController.AddState(hitMissState, true);
            }
            else
            {
                bossStateController.AddState(hitState, true);
            }
        }

        public void ComboHit(int bonusMultiplier)
        {
            DecreaseBossLife(bonusMultiplier);
            bossStateController.RemoveState(hitState);
            bossStateController.AddState(comboHitState);
        }

        private void OnHypeAttackCallback()
        {
            // TODO
        }

        private void HitStateActivateEventHandler(CharacterState sender)
        {
            DecreaseBossLife();
            StaminaController.DecreaseStamina();
            HypeController.IncreaseHype();
            playerPropertyService.IncreaseExperience();
        }

        private void ComboHitStateActivateEventHandler(CharacterState sender)
        {
            this.gameObject.FindAudioSource(KnockOutFallAudioClip).Play();
            this.gameObject.FindAudioSource(KnockOutVoiceAudioClip).Play();
        }

        public bool HitAnimationSequenceCompleteEventHandler(CharacterState sender)
        {
            bossStateController.RemoveState(hitState);
            return false;
        }

        public bool ComboHitAnimationSequenceCompleteEventHandler(CharacterState sender)
        {
            bossStateController.RemoveState(comboHitState);
            return false;
        }

        private void HitMissStateActivateEventHandler(CharacterState sender)
        {
            BossAttackFeedbackController.ShowHitMissFeedback();
        }

        public bool HitMissAnimationSequenceCompleteEventHandler(CharacterState sender)
        {
            bossStateController.RemoveState(hitMissState);
            return false;
        }
        private void KnockOutStateActivateEventHandler(CharacterState sender)
        {
            BossDeathController.BeginKill();
        }

        public bool OnKnockOutAnimationSequenceEndCallback(CharacterState sender)
        {
            BossDeathController.EndKill();
            return true;
        }

        public void BossStatusUpdateEventHandler()
        {
            UpdateBossStatusDisplayValues();
        }

        private void UpdateBossStatusDisplayValues()
        {
            HealthPointSliderController.MaxValue = bossStatusService.MaximumBossLife;
            HealthPointSliderController.Value = bossStatusService.CurrentBossLife;
        }

        public void BossDeadEventHandler()
        {
            bossStatusService.OnBossStatusUpdate -= BossStatusUpdateEventHandler;
            bossStateController.AddState(knockOutState, false);
        }

        public void DecreaseBossLife(int multiplier = 1)
        {
            int bossLifeDecreaseValue = gameControlService.BaseBossDamage * playerPropertyService.AttackPowerLevel * multiplier * 30;
            bossStatusService.CurrentBossLife -= bossLifeDecreaseValue;
            BossAttackFeedbackController.ShowAttackFeedback(bossLifeDecreaseValue);
        }
    }

}