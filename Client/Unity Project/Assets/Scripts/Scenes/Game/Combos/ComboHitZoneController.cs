using UnityEngine;
using System.Collections;
using Assets.Scripts.Extensions;
using UnityEngine.UI;
using Assets.Scripts.Utils;

namespace Assets.Scripts.Scenes.Game.Combos
{
    public class ComboHitZoneController : MonoBehaviour
    {

        // Configurable script parameters
        public float FadeInDuration;
        public float FadeOutDuration;

        public bool Active
        {
            get
            {
                return active;
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

        private bool active;
        private bool fadingIn;

        // Use this for initialization
        void Start()
        {
            active = false;
            fadingIn = true;
        }

        void Update()
        {
            if (Time.time - startTime > TotalDuration)
            {
                active = false;
                this.gameObject.SetActive(false);
            }
            else {
                active = true;
                Animate();
            }
        }

        private void Animate()
        {
            float alpha = 0;
            Image image = this.GetComponentInChildren<Image>();
            if (Time.time - startTime > FadeInDuration)
            {
                alpha = AnimationUtils.EaseIn(Time.time - startTime, FadeOutDuration);
            }
            else
            {
                alpha = AnimationUtils.EaseIn(Time.time - startTime, FadeInDuration);
            }
            image.color = new Color(image.color.r, image.color.g, image.color.b, alpha);
        }

        public void Show(Vector2 position)
        {
            this.transform.position = position.ToVector3(this.transform.position.z);
            startTime = Time.time;
            this.gameObject.SetActive(true);
        }
    }
}