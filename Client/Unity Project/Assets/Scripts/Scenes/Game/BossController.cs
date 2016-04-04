﻿using UnityEngine;
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
using Assets.Scripts.Scenes.Game.Stamina;
using Assets.Scripts.Scenes.Game.Hype;

namespace Assets.Scripts.Scenes.Game
{

    public class BossController : MonoBehaviour
    {
        public const int DEFAULT_ATTACK_VALUE = 1000;
        private const int MISS_STATE_PRIORITY = 1;
        private const int MISS_STATE_ANIMATION_PRIORITY = 1;
        private const int KNOCK_OUT_STATE_PRIORITY = 2;
        private const int KNOCK_OUT_STATE_ANIMATION_PRIORITY = 2;
        private const int HIT_STATE_PRIORITY = 3;
        private const int HIT_STATE_ANIMATION_PRIORITY = 3;
        private const int IDLE_STATE_PRIORITY = 4;
        private const int IDLE_STATE_ANIMATION_PRIORITY = 4;
        

        //Configurable script parameters
        public int SpritesheetColumnCount = 8;
        public BossHitFeedbackController BossHitFeedbackController;
        public HealthPointSliderController HealthPointSliderController;
        public AudioClip KnockOutFallAudioClip;
        public AudioClip KnockOutVoiceAudioClip;
        public StaminaController StaminaController;
        public HypeController HypeController;

        public delegate void BossDeadEventHandler();
        public event BossDeadEventHandler OnBossDead;

        private CharacterStateController bossStateController;
        private CharacterState idleState;
        private CharacterState hitState;
        private CharacterState knockOutState;
        private CharacterState missState;
        private SpriteAnimationSequence idleSequence1 = new SpriteAnimationSequence(new List<int> { 0, 1 }, 5, 3);
        private SpriteAnimationSequence idleSequence2 = new SpriteAnimationSequence(new List<int> { 2, 3 }, 5, 3);
        private SpriteAnimationSequence hitSequence1 = new SpriteAnimationSequence(new List<int> { 18 }, 2, 1);
        private SpriteAnimationSequence hitSequence2 = new SpriteAnimationSequence(new List<int> { 22 }, 2, 1);
        private SpriteAnimationSequence hitSequence3 = new SpriteAnimationSequence(new List<int> { 24 }, 2, 1);
        private SpriteAnimationSequence knockOutSequence1 = new SpriteAnimationSequence(new List<int> { 26, 28, 30, 31 }, 5, 1);
        private SpriteAnimationSequence knockOutSequence2 = new SpriteAnimationSequence(new List<int> { 23, 27, 29, 30, 31 }, 5, 1);
        private SpriteAnimationSequence missSequence = new SpriteAnimationSequence(new List<int> { 16 },1,1);

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
            missState = new CharacterState("Miss", MISS_STATE_PRIORITY, MISS_STATE_ANIMATION_PRIORITY, missStateAnimationSettings);
            missState.SpriteAnimationSequences = new List<SpriteAnimationSequence> { missSequence };

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
            hitState.OnActivate = OnHitStateActivateCallback;
            hitState.OnAnimationSequenceEnd = OnHitAnimationSequenceEndCallback;
            knockOutState.OnActivate = OnKnockOutStateActivatCallbacke;
            knockOutState.OnAnimationSequenceEnd = OnKnockOutAnimationSequenceEndCallback;
            missState.OnAnimationSequenceEnd = OnMissAnimationSequenceEndCallback;
        }

        void Update()
        {
            bossStateController.Update();
        }

        public void OnMouseDown()
        {
            if (StaminaController.checkMiss())
            {
                bossStateController.AddState(hitState, true);
            }
            else
            {
                bossStateController.AddState(missState, true);
                BossHitFeedbackController.Miss();
            }
        }

        public void KnockOut()
        {
            bossStateController.RemoveState(hitState);
            bossStateController.AddState(knockOutState);
        }

        private void OnHitStateActivateCallback(CharacterState sender)
        {
            RemoveBossLife(DEFAULT_ATTACK_VALUE);
            StaminaController.drainHitStamina();
            HypeController.addHitHype();
            BossHitFeedbackController.Hit(DEFAULT_ATTACK_VALUE);
        }

        private void OnKnockOutStateActivatCallbacke(CharacterState sender)
        {
            this.gameObject.FindAudioSource(KnockOutFallAudioClip).Play();
            this.gameObject.FindAudioSource(KnockOutVoiceAudioClip).Play();
        }

        public bool OnHitAnimationSequenceEndCallback(CharacterState sender)
        {
            bossStateController.RemoveState(hitState);
            return false;
        }

        public bool OnKnockOutAnimationSequenceEndCallback(CharacterState sender)
        {
            bossStateController.RemoveState(knockOutState);
            return false;
        }

        public bool OnMissAnimationSequenceEndCallback(CharacterState sender)
        {
            bossStateController.RemoveState(missState);
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
            BossHitFeedbackController.PowerHit();
        }
    }

}