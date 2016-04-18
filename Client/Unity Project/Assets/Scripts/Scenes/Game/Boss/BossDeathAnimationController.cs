using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using System;
using Assets.Scripts.Services;

namespace Assets.Scripts.Scenes.Game.Boss
{
    public class BossDeathAnimationController : MonoBehaviour
    {
        private const float BOSS_FALL_ANIMATION_BEGIN_TIME = 3f;
        private const float KILL_ANIMATION_GRAVITY_SCALE = 3f;

        //Configurable script parameters
        public BossDeathExplosionController BossDeathExplosionController;
        public GameObject Hud;
        public GameObject SceneBackground;

        private Vector3 moveDirection;
        private DateTime animationStartTime;

        public void Animate()
        {
            if ((DateTime.Now - animationStartTime).TotalSeconds > BOSS_FALL_ANIMATION_BEGIN_TIME)
            {
                ApplyGravity();
            }
        }

        public void BeginDeathAnimation()
        {
            SceneBackground.SetActive(false);
            Hud.SetActive(false);
            BossDeathExplosionController.Explode();
            moveDirection = Vector3.zero;
            animationStartTime = DateTime.Now;
        }

        private void ApplyGravity()
        {
            float gravityDelta = Physics2D.gravity.y * Time.deltaTime;
            moveDirection.y = moveDirection.y + gravityDelta;
            this.transform.localPosition += moveDirection;
        }
    }
}