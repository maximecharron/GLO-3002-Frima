using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using System;
using Assets.Scripts.Services;

namespace Assets.Scripts.Scenes.Game.Boss
{
    public class BossDeathAnimationController : MonoBehaviour
    {
        private const int KILL_ANIMATION_GRAVITY_SCALE = 3;

        //Configurable script parameters
        public BossDeathExplosionController BossDeathExplosionController;
        public GameObject Hud;
        public GameObject SceneBackground;

        private Vector3 moveDirection;

        public void Animate()
        {
            ApplyGravity();
        }

        public void BeginDeathAnimation()
        {
            SceneBackground.SetActive(false);
            Hud.SetActive(false);
            BossDeathExplosionController.Explode();
            moveDirection = Vector3.zero;
        }

        private void ApplyGravity()
        {
            float gravityDelta = Physics2D.gravity.y * Time.deltaTime;
            moveDirection.y = moveDirection.y + gravityDelta;
            this.transform.localPosition += moveDirection;
        }
    }
}