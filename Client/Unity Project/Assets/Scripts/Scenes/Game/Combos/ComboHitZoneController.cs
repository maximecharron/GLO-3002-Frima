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

        // Use this for initialization
        void Start()
        {
            fadingIn = true;
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

        private void SetAlpha(float alpha)
        {
            Image image = this.GetComponent<Image>();
            image.color = new Color(image.color.r, image.color.g, image.color.b, alpha);
        }

        public void Show(Vector2 position)
        {
            this.transform.localPosition = position.ToVector3(this.transform.localPosition.z);
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