using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using System;
using Assets.Scripts.Services;

namespace Assets.Scripts.Scenes.Game.Boss
{
    public class BossDeathController : MonoBehaviour
    {
        private const float KILL_ANIMATION_WAIT_TIME = 1.5f;
        private const int KILL_ANIMATION_GRAVITY_SCALE = 3;

        //Configurable script parameters
        public BossDeathExplosionController BossDeathExplosionController;
        public GameObject UI;
        public GameObject SceneBackground;

        public delegate void BossDeathStartEventHandler();
        public event BossDeathStartEventHandler OnBossDeathStart = delegate { };
        public delegate void BossDeathEndEventHandler();
        public event BossDeathEndEventHandler OnBossDeathEnd = delegate { };

        private bool killEndAnimationStarted = false;
        private DateTime killEndAnimationDate;
        private Vector3 moveDirection;

        void Update()
        {
            if (killEndAnimationStarted)
            {
                ApplyGravity();
                if ((DateTime.Now - killEndAnimationDate).TotalSeconds > KILL_ANIMATION_WAIT_TIME)
                {
                    OnBossDeathEnd();
                }
            }
        }

        public void BeginKill()
        {
            SceneBackground.SetActive(false);
            UI.SetActive(false);
            BossDeathExplosionController.Explode();
            OnBossDeathStart();
        }

        public void EndKill()
        {
            if (!killEndAnimationStarted)
            {
                moveDirection = Vector3.zero;
                killEndAnimationStarted = true;
                killEndAnimationDate = DateTime.Now;
            }
        }

        private void ApplyGravity()
        {
            float gravityDelta = Physics2D.gravity.y * Time.deltaTime;
            moveDirection.y = moveDirection.y + gravityDelta;
            this.transform.localPosition += moveDirection;
        }
    }
}