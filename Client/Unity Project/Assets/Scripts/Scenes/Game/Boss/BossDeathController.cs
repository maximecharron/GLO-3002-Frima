using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using System;

namespace Assets.Scripts.Scenes.Game.Boss
{
    public class BossDeathController : MonoBehaviour
    {
        private const float KILL_ANIMATION_WAIT_TIME = 1.5f;
        private const int KILL_ANIMATION_GRAVITY_SCALE = 3;

        //Configurable script parameters
        public BossDeathExplosionController BossDeathExplosionController;
        public GameObject SceneBackground;

        public delegate void BossDeathStartEventHandler();
        public event BossDeathStartEventHandler OnBossDeathStart;
        public delegate void BossDeathEndEventHandler();
        public event BossDeathEndEventHandler OnBossDeathEnd;

        private bool killFinishAnimationStarted = false;
        private DateTime killFinishAnimationDate;
        private Vector3 moveDirection;

        public void InitKill()
        {
            SceneBackground.SetActive(false);
            BossDeathExplosionController.Explode();
            OnBossDeathStart();
        }

        public void FinishKill()
        {
            if (!killFinishAnimationStarted)
            {
                moveDirection = Vector3.zero;
                killFinishAnimationStarted = true;
                killFinishAnimationDate = DateTime.Now;
            }
        }

        private void ApplyGravity()
        {
            float gravityDelta = Physics2D.gravity.y * Time.deltaTime;
            moveDirection.y = moveDirection.y + gravityDelta;
            this.transform.localPosition += moveDirection;
        }

        void Update()
        {
            if (killFinishAnimationStarted)
            {
                ApplyGravity();
                if ((DateTime.Now - killFinishAnimationDate).TotalSeconds > KILL_ANIMATION_WAIT_TIME) {
                    OnBossDeathEnd();
                }
            }
        }
    }
}