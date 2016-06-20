using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.Stamina
{
    public class StaminaSliderController : MonoBehaviour
    {


        //Configurable script parameters
        public Slider StaminaSlider;
        public Image SliderFill;
        public Color LowStaminaColor;
        public Color MediumStaminaColor;
        public float MediumStaminaTreshold = 1f / 3f;
        public Color HighStaminaColor;
        public float HighStaminaTreshold = 2f / 3f;

        public float MaxValue
        {
            get { return StaminaSlider.maxValue; }
            set { StaminaSlider.maxValue = value; }
        }

        public float Value
        {
            get { return StaminaSlider.value; }
            set
            {
                StaminaSlider.value = value;
                SliderFill.color = GetHealthSliderColor(value / StaminaSlider.maxValue);
            }
        }

        private Color GetHealthSliderColor(float value)
        {
            if (value < MediumStaminaTreshold)
            {
                return LowStaminaColor;
            }
            else if (value < HighStaminaTreshold)
            {
                return MediumStaminaColor;
            }
            else
            {
                return HighStaminaColor;
            }
        }
    }
}
