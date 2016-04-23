using System;
using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using Assets.Scripts.Animation.DualStateAnimation;

namespace Assets.Scripts.Scenes.Game.Hype
{
    public class HypeSliderController : MonoBehaviour
    {
        //Configurable script parameters
        public Slider HypeSlider;
        public Image SliderFill;
        public Color originalColor;
        public Color flashColor;

        public bool SliderFlashEnabled {
            get { return GetComponent<DualStateAnimator>().Enabled; }
            set { GetComponent<DualStateAnimator>().Enabled = value; }
        }

        private float lastFlashTimeDelta = 0;

        public float MaxValue
        {
            get { return HypeSlider.maxValue; }
            set { HypeSlider.maxValue = value; }
        }

        public float Value
        {
            get { return HypeSlider.value; }
            set { HypeSlider.value = value; }
        }

        void Start()
        {
            GetComponent<DualStateAnimator>().stateAlternateAction = AlternateSliderColor;
            HypeSlider.value = 0;
        }

        private void AlternateSliderColor()
        {
            SliderFill.color = SliderFill.color.Equals(flashColor) ? originalColor : flashColor;
        }
    }
}
