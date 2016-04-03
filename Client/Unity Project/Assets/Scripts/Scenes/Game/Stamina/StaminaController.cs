using System;
using UnityEngine;
using System.Collections;
using UnityEngine.UI;


namespace Assets.Scripts.Scenes.Game
{
    
    
    public class StaminaController : MonoBehaviour
    {

        public StaminaSliderController StaminaSliderController;
        public Button RestoreStaminaButton;
        private const float STAMINA_DRAIN_ON_HIT = 5f ;
        private const float STAMINA_RESTORE_VALUE = 0.5f;
        private const float STAMINA_RESTORATION_FREQUENCY_SECONDS = 0.05f;
        private DateTime lastUpdateCall = DateTime.Now;

        public void drainHitStamina()
        {
            StaminaSliderController.Value -= STAMINA_DRAIN_ON_HIT;
        }

        public void restoreStamina(int staminaCount)
        {  

        }

        public void OnStaminaButtonClick()
        {
            StaminaSliderController.Value = StaminaSliderController.MaxValue;
        }

        void Start()
        {
            StaminaSliderController.Value = StaminaSliderController.MaxValue;
        }

        void Update()
        {
            if (DateTime.Now.Subtract(lastUpdateCall).TotalSeconds > STAMINA_RESTORATION_FREQUENCY_SECONDS)
            {
                if (StaminaSliderController.Value + STAMINA_RESTORE_VALUE <= StaminaSliderController.MaxValue)
                {
                    StaminaSliderController.Value += STAMINA_RESTORE_VALUE;
                }
                else
                {
                    StaminaSliderController.Value += (StaminaSliderController.MaxValue - StaminaSliderController.Value);
                }
                lastUpdateCall = DateTime.Now;
            }
        }

        public bool checkMiss()
        {
            var randomValue = UnityEngine.Random.value;
            var staminaValue = StaminaSliderController.Value;
            var hit = false;
            if (staminaValue > 80)
            {
                hit = true;
            }
            if (staminaValue > 50 && staminaValue <= 80)
            {
                hit = randomValue > 0.1;
            }

            if (staminaValue > 30 && staminaValue <= 50)
            {
                hit = randomValue > 0.3;
            }

            if (staminaValue > 10 && staminaValue <= 30)
            {
                hit = randomValue > 0.4;
            }

            if (staminaValue > 5 && staminaValue <= 10)
            {
                hit = randomValue > 0.6;
            }

            if (staminaValue <= 5)
            {
                hit = false;
            }
            return hit;
        }
    }

}

