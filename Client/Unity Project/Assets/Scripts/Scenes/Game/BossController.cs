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

namespace Assets.Scripts.Scenes.Game
{

    public class BossController : MonoBehaviour
    {
        public const int DEFAULT_ATTACK_VALUE = 5000;
        private const int KNOCK_OUT_STATE_PRIORITY = 1;
        private const int KNOCK_OUT_STATE_ANIMATION_PRIORITY = 1;
        private const int HIT_STATE_PRIORITY = 2;
        private const int HIT_STATE_ANIMATION_PRIORITY = 2;
        private const int IDLE_STATE_PRIORITY = 3;
        private const int IDLE_STATE_ANIMATION_PRIORITY = 3;

        //Configurable script parameters
        public int SpritesheetColumnCount = 6;
        public BossHitFeedbackController BossHitFeedbackController;
        public HealthPointSliderController HealthPointSliderController;

        public delegate void BossDeadEventHandler();
        public event BossDeadEventHandler OnBossDead;

        private CharacterStateController bossStateController;
        private CharacterState idleState;
        private CharacterState hitState;
        private CharacterState knockOutState;
        private SpriteAnimationSequence idleSequence1 = new SpriteAnimationSequence(new List<int> { 0, 1 }, 5, 3);
        private SpriteAnimationSequence idleSequence2 = new SpriteAnimationSequence(new List<int> { 2, 3 }, 5, 3);
        private SpriteAnimationSequence hitSequence1 = new SpriteAnimationSequence(new List<int> { 18 }, 2, 1);
        private SpriteAnimationSequence hitSequence2 = new SpriteAnimationSequence(new List<int> { 22 }, 2, 1);
        private SpriteAnimationSequence hitSequence3 = new SpriteAnimationSequence(new List<int> { 24 }, 2, 1);
        private SpriteAnimationSequence knockOutSequence1 = new SpriteAnimationSequence(new List<int> { 26, 28, 30, 31 }, 5, 1);
        private SpriteAnimationSequence knockOutSequence2 = new SpriteAnimationSequence(new List<int> { 23, 27, 29, 30, 31 }, 5, 1);

        private WebSocketService webSocketService;
        private int currentBossLife = 0;

        void Start()
        {
            InitializeStateController();
            InitializeStates();
            AssignStateActions();
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
            SpriteAnimationSettings hitStateAnimationSettings = new SpriteAnimationSettings(true);
            hitState = new CharacterState("Hit", HIT_STATE_PRIORITY, HIT_STATE_ANIMATION_PRIORITY, hitStateAnimationSettings);
            hitState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { hitSequence1, hitSequence2, hitSequence3 };

            SpriteAnimationSettings knockOutStateAnimationSettings = new SpriteAnimationSettings(true);
            knockOutState = new CharacterState("Knock Out", KNOCK_OUT_STATE_PRIORITY, KNOCK_OUT_STATE_ANIMATION_PRIORITY, knockOutStateAnimationSettings);
            knockOutState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { knockOutSequence1, knockOutSequence2 };

            SpriteAnimationSettings idleStateAnimationSettings = new SpriteAnimationSettings(true);
            idleState = new CharacterState("Idle", IDLE_STATE_PRIORITY, IDLE_STATE_ANIMATION_PRIORITY, idleStateAnimationSettings);
            idleState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { idleSequence1, idleSequence2 };

            bossStateController.AddState(idleState);
        }

        private void AssignStateActions()
        {
            hitState.OnActivate = OnHitStateActivate;
            hitState.OnAnimationSequenceEnd = OnHitAnimationSequenceEnd;
            knockOutState.OnAnimationSequenceEnd = OnKnockOutAnimationSequenceEnd;
        }

        void Update()
        {
            bossStateController.Update();
        }

        public void OnMouseDown()
        {
            bossStateController.AddState(hitState, true);
        }

        public void KnockOut()
        {
            bossStateController.RemoveState(hitState);
            bossStateController.AddState(knockOutState);
        }

        private void OnHitStateActivate(CharacterState sender)
        {
            RemoveBossLife(DEFAULT_ATTACK_VALUE);
            BossHitFeedbackController.Hit(DEFAULT_ATTACK_VALUE);
        }

        public bool OnHitAnimationSequenceEnd(CharacterState sender)
        {
            bossStateController.RemoveState(hitState);
            return false;
        }

        public bool OnKnockOutAnimationSequenceEnd(CharacterState sender)
        {
            bossStateController.RemoveState(knockOutState);
            return false;
        }

        public void BossStatusUpdateCallback(CommandDTO commandDTO)
        {
            var bossStatusUpateParams = ((BossStatusUpdateCommandDTO)commandDTO).command.parameters;
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
            webSocketService.SendCommand(new BossAttackCommandDTO(DEFAULT_ATTACK_VALUE));
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
    }

}