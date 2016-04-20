using UnityEngine;
using System.Collections.Generic;
using Assets.Scripts.Animation.SpriteAnimation;
using Assets.Scripts.CharacterControl;
using Assets.Scripts.Extensions;
using Assets.Scripts.Scenes.Game.Stamina;
using Assets.Scripts.Scenes.Game.Hype;
using Assets.Scripts.Services;
using Assets.Scripts.Services.BossStatus;
using Assets.Scripts.Scenes.Game.Combos;

namespace Assets.Scripts.Scenes.Game.Boss
{
    [RequireComponent(typeof(Renderer))]
    public class BossController : MonoBehaviour
    {
        private const int DEAD_STATE_PRIORITY = 1;
        private const int DEAD_STATE_ANIMATION_PRIORITY = 1;
        private const int COMBO_HIT_STATE_PRIORITY = 2;
        private const int COMBO_HIT_STATE_ANIMATION_PRIORITY = 2;
        private const int HYPE_ATTACK_STATE_PRIORITY = 3;
        private const int HYPE_ATTACK_STATE_ANIMATION_PRIORITY = 3;
        private const int HIT_MISS_STATE_PRIORITY = 4;
        private const int HIT_MISS_STATE_ANIMATION_PRIORITY = 4;
        private const int HIT_STATE_PRIORITY = 5;
        private const int HIT_STATE_ANIMATION_PRIORITY = 5;
        private const int IDLE_STATE_PRIORITY = 6;
        private const int IDLE_STATE_ANIMATION_PRIORITY = 7;

        //Configurable script parameters
        public int SpritesheetColumnCount = 8;
        public GameSceneController GameSceneController;
        public BossAttackFeedbackController BossAttackFeedbackController;
        public BossDeathAnimationController BossDeathAnimationController;
        public BossExplosionController BossDeathExplosionController;
        public ComboHitController ComboHitController;
        public StaminaController StaminaController;
        public HypeController HypeController;
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
        private CharacterState hypeAttackState;
        private CharacterState deadState;
        private SpriteAnimationSequence idleSequence1 = new SpriteAnimationSequence(new List<int> { 0, 1 }, 5, 3);
        private SpriteAnimationSequence idleSequence2 = new SpriteAnimationSequence(new List<int> { 2, 3 }, 5, 3);
        private SpriteAnimationSequence hitSequence1 = new SpriteAnimationSequence(new List<int> { 18 }, 2, 1);
        private SpriteAnimationSequence hitSequence2 = new SpriteAnimationSequence(new List<int> { 22 }, 2, 1);
        private SpriteAnimationSequence hitSequence3 = new SpriteAnimationSequence(new List<int> { 24 }, 2, 1);
        private SpriteAnimationSequence comboHitSequence1 = new SpriteAnimationSequence(new List<int> { 26, 28, 30, 31 }, 5, 1);
        private SpriteAnimationSequence comboHitSequence2 = new SpriteAnimationSequence(new List<int> { 23, 27, 29, 30, 31 }, 5, 1);
        private SpriteAnimationSequence hitMissSequence = new SpriteAnimationSequence(new List<int> { 16 }, 2, 1);
        private SpriteAnimationSequence hypeAttackSequence = new SpriteAnimationSequence(new List<int> { 20, 37 }, 2, 3);
        private SpriteAnimationSequence deathSequence = new SpriteAnimationSequence(new List<int> { 20, 37 }, 2, 5);

        void Start()
        {
            InitializeStateController();
            InitializeStates();
            AssignStateActions();
            InitalizeDependencies();
        }

        void OnDestroy()
        {
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
            hypeAttackState = new CharacterState("Hype Attack State", HYPE_ATTACK_STATE_PRIORITY, HYPE_ATTACK_STATE_ANIMATION_PRIORITY, defaultAnimationSettings);
            hypeAttackState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { comboHitSequence1, comboHitSequence2 };
            hypeAttackState.AddIncompatibleStates(new CharacterState[] { hitState });
            deadState = new CharacterState("Dead", DEAD_STATE_PRIORITY, DEAD_STATE_ANIMATION_PRIORITY, defaultAnimationSettings);
            deadState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { deathSequence };
            deadState.AddIncompatibleStates(new CharacterState[] { hitMissState, hitState, comboHitState });
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
            hypeAttackState.OnActivate += HypeAttackStateActivateEventHandler;
            hypeAttackState.OnAnimationSequenceComplete += HypeAttackAnimationSequenceCompleteEventHandler;
            hitMissState.OnActivate += HitMissStateActivateEventHandler;
            hitMissState.OnAnimationSequenceComplete += HitMissAnimationSequenceCompleteEventHandler;
            deadState.OnActivate += DeadStateActivateEventHandler;
            deadState.OnUpdate += DeadStateUpdateEventHandler;
            deadState.OnAnimationSequenceComplete += DeathAnimationSequenceCompleteEventHandler;
        }

        private void InitalizeDependencies()
        {
            HypeController.OnHypeAttack += HypeAttackEventHandler;
            ComboHitController.OnHitZoneClicked += HitZoneClickedEventHandler;
            ComboHitController.OnComboHitCompleted += ComboHitCompletedEventHandler;
            gameControlService = FindObjectOfType<GameControlService>();
            gameStatisticsService = FindObjectOfType<GameStatisticsService>();
            playerPropertyService = FindObjectOfType<PlayerPropertyService>();
            bossStatusService = FindObjectOfType<BossStatusService>();
            bossStatusService.OnBossDead += BossDeadEventHandler;
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

        public void ComboHitCompletedEventHandler(ComboHitSequence hitSequence)
        {
            DecreaseBossLifeDefault(hitSequence.BonusMultiplier);
            bossStateController.RemoveState(hitState);
            bossStateController.AddState(comboHitState);
        }

        private void HypeAttackEventHandler(int attackValue)
        {
            DecreaseBossLife(attackValue);
            bossStateController.AddState(hypeAttackState);
        }

        private void HitZoneClickedEventHandler(ComboHitZoneController comboHitZoneController)
        {
            OnMouseDown();
        }

        private void HitStateActivateEventHandler(CharacterState sender)
        {
            DecreaseBossLifeDefault();
            StaminaController.DecreaseStamina();
            HypeController.IncreaseHype();
            playerPropertyService.IncreaseExperiencePoints();
        }

        public bool HitAnimationSequenceCompleteEventHandler(CharacterState sender)
        {
            bossStateController.RemoveState(hitState);
            return false;
        }

        private void ComboHitStateActivateEventHandler(CharacterState sender)
        {
            this.gameObject.FindAudioSource(KnockOutFallAudioClip).Play();
            this.gameObject.FindAudioSource(KnockOutVoiceAudioClip).Play();
        }

        public bool ComboHitAnimationSequenceCompleteEventHandler(CharacterState sender)
        {
            bossStateController.RemoveState(comboHitState);
            return false;
        }

        private void HypeAttackStateActivateEventHandler(CharacterState sender)
        {
            BossDeathExplosionController.Explode();
        }

        public bool HypeAttackAnimationSequenceCompleteEventHandler(CharacterState sender)
        {
            bossStateController.RemoveState(hypeAttackState);
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

        private void DeadStateActivateEventHandler(CharacterState sender)
        {
            BossDeathAnimationController.BeginDeathAnimation();
        }

        private void DeadStateUpdateEventHandler(CharacterState sender)
        {
            BossDeathAnimationController.Animate();
        }

        private bool DeathAnimationSequenceCompleteEventHandler(CharacterState sender)
        {
            GameSceneController.ShowVictoryScene();
            return false;
        }

        public void BossDeadEventHandler()
        {
            bossStateController.AddState(deadState, false);
        }

        public void DecreaseBossLifeDefault(int multiplier = 1)
        {
            DecreaseBossLife(gameControlService.BaseBossDamage * playerPropertyService.AttackPowerLevel * multiplier);
        }

        public void DecreaseBossLife(int decreaseValue)
        {
            bossStatusService.CurrentBossLife -= decreaseValue;
            BossAttackFeedbackController.ShowAttackFeedback(decreaseValue);
        }
    }

}