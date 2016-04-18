using System;
using UnityEngine;
using System.Collections;
using Assets.Scripts.Scenes.Game.Combos;
using Assets.Scripts.Scenes.Game.Stamina;
using UnityEngine.UI;
using Assets.Scripts.Services;

namespace Assets.Scripts.Scenes.Game.Hype
{
    public class HypeController : MonoBehaviour
    {
        private const float HYPE_INCREASE_ON_HIT = 3f;
        private const float BASE_HYPE_AUTO_DECREASE_VALUE = 0.5f;
        private const float HYPE_AUTO_DECREASE_FREQUENCY_SECONDS = 0.05f;
        private const float HYPE_POWER_AVAILABLE_TIME_SECONDS = 1.5f;

        //Configurable script parameters
        public ComboHitController ComboHitController;
        public HypeSliderController HypeSliderController;

        public Action OnHypeAttack = delegate { };

        private PlayerPropertyService playerPropertyService;
        private DateTime lastHypeAutoDecrease = DateTime.Now;
        private DateTime lastMaxHypeReach = DateTime.MinValue;
        private bool MaxHypeReached = false;

        void Start()
        {
            playerPropertyService = FindObjectOfType<PlayerPropertyService>();
            HypeSliderController.Value = 0;
            ComboHitController.OnComboHitCompleted = OnComboHitCompletedCallback;
        }

        public void OnHypeButtonClick()
        {
            if (MaxHypeReached)
            {
                OnHypeAttack();
            }
        }

        void OnComboHitCompletedCallback(ComboHitSequence hitSequence)
        {
            IncreaseHype(hitSequence.BonusMultiplier);
        }

        void Update()
        {
            if (HypeSliderController.Value == HypeSliderController.MaxValue && !MaxHypeReached)
            {
                ProcessMaxHypeReached();
            }
            else if ((DateTime.Now - lastHypeAutoDecrease).TotalSeconds > HYPE_AUTO_DECREASE_FREQUENCY_SECONDS)
            {
                AutoDecreaseHype();
                lastHypeAutoDecrease = DateTime.Now;
            }
        }

        private void AutoDecreaseHype()
        {
            if (!MaxHypeReached || (MaxHypeReached && DateTime.Now.Subtract(lastMaxHypeReach).TotalSeconds > HYPE_POWER_AVAILABLE_TIME_SECONDS))
            {
                HypeSliderController.Value = Math.Max(0, HypeSliderController.Value - (BASE_HYPE_AUTO_DECREASE_VALUE / playerPropertyService.HypePowerLevel));
                MaxHypeReached = false;
                HypeSliderController.FlashSlider = false;
            }
        }

        private void ProcessMaxHypeReached()
        {
            lastMaxHypeReach = DateTime.Now;
            MaxHypeReached = true;
            HypeSliderController.FlashSlider = true;
        }

        public void IncreaseHype(float multiplier = 1)
        {
            HypeSliderController.Value += Math.Min(HypeSliderController.MaxValue, HYPE_INCREASE_ON_HIT * multiplier);
        }
    }

}