using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class StaminaSliderController : MonoBehaviour {

    private static Color LOW_STAMINA_SLIDER_COLOR = new Color(216f / 255f, 0, 0);
    private static Color MEDIUM_STAMINA_SLIDER_COLOR = new Color(1, 195f / 255f, 0);
    private static Color HIGH_STAMINA_SLIDER_COLOR = new Color(0, 212f / 255f, 0);
    private static float MEDIUM_STAMINA_TRESHOLD = 1f / 3f;
    private static float HIGH_STAMINA_TRESHOLD = 2f / 3f;
    // Use this for initialization

    public Slider StaminaSlider;
    public Image SliderFill;
    public Text SliderLabel;

    public float MaxValue
    {
        get
        {
            return StaminaSlider.maxValue;
        }
        set
        {
            StaminaSlider.maxValue = value;
        }
    }

    public float Value
    {
        get { return StaminaSlider.value; }
        set
        {
            StaminaSlider.value = value;
            SliderFill.color = GetHealthSliderColor(value / StaminaSlider.maxValue);
            SliderLabel.color = GetHealthSliderColor(value / StaminaSlider.maxValue);
        }
    }

    private Color GetHealthSliderColor(float value)
    {
        if (value < MEDIUM_STAMINA_TRESHOLD)
        {
            return LOW_STAMINA_SLIDER_COLOR;
        }
        else if (value < HIGH_STAMINA_TRESHOLD)
        {
            return MEDIUM_STAMINA_SLIDER_COLOR;
        }
        else
        {
            return HIGH_STAMINA_SLIDER_COLOR;
        }
    }

    void Start()
    {

    }

    // Update is called once per frame
    void Update()
    {

    }
}
