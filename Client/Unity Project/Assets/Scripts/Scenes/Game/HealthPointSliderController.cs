using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using Assets.Scripts.Services.BossStatus;

namespace Assets.Scripts.Scenes.Game
{

    public class HealthPointSliderController : MonoBehaviour
    {
        private static Color LOW_HEALTH_SLIDER_COLOR = new Color(216f / 255f, 0, 0);
        private static Color MEDIUM_HEALTH_SLIDER_COLOR = new Color(1, 195f / 255f, 0);
        private static Color HIGH_HEALTH_SLIDER_COLOR = new Color(0, 212f / 255f, 0);
        private static float MEDIUM_HEALTH_TRESHOLD = 1f / 3f;
        private static float HIGH_HEALTH_TRESHOLD = 2f / 3f;

        //Configurable script parameters
        public Text HealthPointValue;
        public Slider HealthPointSlider;
        public Image SliderFill;

        private BossStatusService bossStatusService;

        void Start()
        {
            bossStatusService = FindObjectOfType<BossStatusService>();
            bossStatusService.OnBossStatusUpdate += BossStatusUpdateEventHandler;
            UpdateBossStatusDisplayValues();
        }

        void OnDestroy()
        {
            bossStatusService.OnBossStatusUpdate -= BossStatusUpdateEventHandler;
        }

        public void BossStatusUpdateEventHandler()
        {
            UpdateBossStatusDisplayValues();
        }

        private void UpdateBossStatusDisplayValues()
        {
            HealthPointSlider.maxValue = bossStatusService.MaximumBossLife;
            HealthPointSlider.value = bossStatusService.CurrentBossLife;
            HealthPointValue.text = bossStatusService.CurrentBossLife.ToString();
            SliderFill.color = GetHealthSliderColor(HealthPointSlider.value / HealthPointSlider.maxValue);
        }

        private Color GetHealthSliderColor(float value)
        {
            if (value < MEDIUM_HEALTH_TRESHOLD)
            {
                return LOW_HEALTH_SLIDER_COLOR;
            }
            else if (value < HIGH_HEALTH_TRESHOLD)
            {
                return MEDIUM_HEALTH_SLIDER_COLOR;
            }
            else
            {
                return HIGH_HEALTH_SLIDER_COLOR;
            }
        }
    }
}