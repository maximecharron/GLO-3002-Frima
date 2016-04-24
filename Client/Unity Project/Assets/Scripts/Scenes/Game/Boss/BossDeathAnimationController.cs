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
        private const float KILL_ANIMATION_GRAVITY_SCALE = 0.05f;

        //Configurable script parameters
        public BossExplosionController BossDeathExplosionController;
        public GameObject UI;
        public GameObject SceneBackground;

        private Vector3 moveDirection;
        private float animationStartTimeDelta;

        public void Animate()
        {
            animationStartTimeDelta += Time.deltaTime;
            if (animationStartTimeDelta > BOSS_FALL_ANIMATION_BEGIN_TIME)
            {
                ApplyGravity();
            }
        }

        public void BeginDeathAnimation()
        {
            SceneBackground.SetActive(false);
            UI.SetActive(false);
            BossDeathExplosionController.Explode();
            moveDirection = Vector3.zero;
            animationStartTimeDelta = 0;
        }

        private void ApplyGravity()
        {
            float gravityDelta = Physics2D.gravity.y * Time.deltaTime * KILL_ANIMATION_GRAVITY_SCALE;
            moveDirection.y = moveDirection.y + gravityDelta;
            this.transform.localPosition += moveDirection;
        }
    }
}