using UnityEngine;
using System.Collections;
using Assets.Scripts.Extensions;
using UnityEngine.UI;
using Assets.Scripts.Utils;
using System;

namespace Assets.Scripts.Scenes.Game.Combos
{
    public class ComboHitZoneController : MonoBehaviour
    {
        private static float HIT_SOUND_BASE_PITCH = 1f;
        private static float HIT_SOUND_PITCH_INCREMENT_MULTIPLIER = 0.3f;

        // Configurable script parameters
        public float FadeInDuration;
        public float FadeOutDuration;

        public Action<ComboHitZoneController> OnHitZoneClicked { get; set; }

        public bool Active
        {
            get
            {
                return this.gameObject.activeSelf;
            }
        }

        public float TotalDuration
        {
            get
            {
                return FadeInDuration + FadeOutDuration;
            }
        }

        private float startTime;
        public float StartTime
        {
            get
            {
                return startTime;
            }
        }

        private bool fadingIn;
        private ComboHitFeedbackBubbleController comboHitFeedbackBubbleController;

        // Use this for initialization
        void Start()
        {
            fadingIn = true;
            comboHitFeedbackBubbleController = this.GetComponentInChildren<ComboHitFeedbackBubbleController>(true);
        }

        void Update()
        {
            Animate();
        }

        void OnMouseDown()
        {
            if (OnHitZoneClicked != null)
            {
                OnHitZoneClicked(this);
            }
        }

        private void Animate()
        {
            if (Time.time - startTime > TotalDuration)
            {
                SetAlpha(0);
            }
            else if (Time.time - startTime > FadeInDuration)
            {
                SetAlpha(1 - AnimationUtils.LinearTween(Time.time - startTime - FadeInDuration, FadeOutDuration));
            }
            else
            {
                SetAlpha(AnimationUtils.ExponentialEaseOut(Time.time - startTime, FadeInDuration));
            }
        }

        public void PlayHitSound(float sequenceProgress)
        {
            AudioSource audioSource = this.GetComponent<AudioSource>();
            audioSource.pitch = HIT_SOUND_BASE_PITCH + sequenceProgress * HIT_SOUND_PITCH_INCREMENT_MULTIPLIER;
            audioSource.Play();
        }

        private void SetAlpha(float alpha)
        {
            Image image = this.GetComponent<Image>();
            image.color = new Color(image.color.r, image.color.g, image.color.b, alpha);
        }

        public void Show(Vector2 position, float zPosition)
        {
            this.transform.localPosition = position.ToVector3(zPosition);
            startTime = Time.time;
            SetAlpha(0);
            this.gameObject.SetActive(true);
        }

        public void Hide()
        {
            this.gameObject.SetActive(false);
        }
    }
}