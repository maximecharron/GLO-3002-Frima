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
        public Image SceneBackground;

        public delegate void BossDeathStartEventHandler();
        public event BossDeathStartEventHandler OnBossDeathStart;
        public delegate void BossDeathEndEventHandler();
        public event BossDeathEndEventHandler OnBossDeathEnd;

        private bool killFinishAnimationStarted = false;
        private DateTime killFinishAnimationDate;

        public void InitKill()
        {
            SceneBackground.color = Color.black;
            BossDeathExplosionController.Explode();
            OnBossDeathStart();
        }

        public void FinishKill()
        {
            if (!killFinishAnimationStarted)
            {
                Rigidbody2D rigibody2d = this.gameObject.AddComponent<Rigidbody2D>();
                rigibody2d.gravityScale = KILL_ANIMATION_GRAVITY_SCALE;
                killFinishAnimationStarted = true;
                killFinishAnimationDate = DateTime.Now;
            }
        }

        void Update()
        {
            if (killFinishAnimationStarted && (DateTime.Now - killFinishAnimationDate).TotalSeconds > KILL_ANIMATION_WAIT_TIME)
            {
                OnBossDeathEnd();
            }
        }
    }
}