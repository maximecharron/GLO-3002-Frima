using System;
using UnityEngine;
using System.Collections;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.Hype
{
    public class HypeSliderController : MonoBehaviour
    {

        public Slider HypeSlider;
        public Image SliderFill;
        public Text SliderLabel;
        public bool FlashSlider { get; set; }
        private DateTime lastFlashTime = DateTime.MinValue;
        private const float FLASH_INTERVAL_SECONDS = 0.1f;
        private Color originalColor = new Color(146f / 255f, 158f / 255f, 242f/255f);
        private Color flashColor = new Color(184f / 255f, 40f / 255f, 172f / 255f);

        public float MaxValue
        {
            get { return HypeSlider.maxValue; }
            set { HypeSlider.maxValue = value; }
        }

        public float Value
        {
            get { return HypeSlider.value; }
            set
            {
                HypeSlider.value = value;
            }
        }


        // Use this for initialization
        void Start()
        {

        }

        // Update is called once per frame
        void Update()
        {
            if (FlashSlider)
            {
                if (DateTime.Now.Subtract(lastFlashTime).TotalSeconds > FLASH_INTERVAL_SECONDS)
                {
                    lastFlashTime = DateTime.Now;
                    changeColor();
                }
            }
        }

        void changeColor()
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
