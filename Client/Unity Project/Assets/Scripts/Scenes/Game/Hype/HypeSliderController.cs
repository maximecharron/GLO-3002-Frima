using System;
using UnityEngine;
using System.Collections;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.Hype
{
    public class HypeSliderController : MonoBehaviour
    {
        private const float FLASH_INTERVAL_SECONDS = 0.1f;
        private static Color originalColor = new Color(146f / 255f, 158f / 255f, 242f / 255f);
        private static Color flashColor = new Color(184f / 255f, 40f / 255f, 172f / 255f);

        //Configurable script parameters
        public Slider HypeSlider;
        public Image SliderFill;

        public bool FlashSlider { get; set; }

        private DateTime lastFlashTime = DateTime.MinValue;

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

        void Update()
        {
            if (FlashSlider)
            {
                if (DateTime.Now.Subtract(lastFlashTime).TotalSeconds > FLASH_INTERVAL_SECONDS)
                {
                    lastFlashTime = DateTime.Now;
                    alternateSliderColor();
                }
            }
        }

        void alternateSliderColor()
        {
            if (SliderFill.color.Equals(flashColor))
            {
                SliderFill.color = originalColor;
            }
            else
            {
                SliderFill.color = flashColor;
            }
        }
    }
}
