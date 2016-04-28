using Assets.Scripts.Animation.DualStateAnimation;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.Hype
{
    public class HypeSliderController : MonoBehaviour
    {
        //Configurable script parameters
        public Slider HypeSlider;
        public Image SliderFill;
        public Color OriginalColor;
        public Color FlashColor;

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
            SliderFill.color = SliderFill.color.Equals(FlashColor) ? OriginalColor : FlashColor;
        }
    }
}
