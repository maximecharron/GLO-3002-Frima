using System;
using UnityEngine;
using System.Collections;
using UnityEngine.UI;


namespace Assets.Scripts.Scenes.Game.Stamina
{


    public class StaminaController : MonoBehaviour
    {
        private const float STAMINA_DECREASE_ON_HIT = 5f;
        private const float STAMINA_RESTORE_VALUE = 0.5f;
        private const float STAMINA_RESTORATION_FREQUENCY_SECONDS = 0.05f;

        //Configurable script parameters
        public StaminaSliderController StaminaSliderController;

        private DateTime lastStaminaAutoIncrease = DateTime.Now;

        public void DecreaseStamina()
        {
            StaminaSliderController.Value -= STAMINA_DECREASE_ON_HIT;
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
            if (DateTime.Now.Subtract(lastStaminaAutoIncrease).TotalSeconds > STAMINA_RESTORATION_FREQUENCY_SECONDS)
            {
                AutoIncreaseStamina();
                lastStaminaAutoIncrease = DateTime.Now;
            }
        }

        private void AutoIncreaseStamina()
        {
            StaminaSliderController.Value = Math.Min(StaminaSliderController.Value + STAMINA_RESTORE_VALUE, StaminaSliderController.MaxValue);
        }

        public bool IsHitMiss()
        {
            var randomValue = UnityEngine.Random.value;
            var staminaValue = StaminaSliderController.Value;
            bool hitMiss = false;

            if (staminaValue > 50 && staminaValue <= 80)
            {
                hitMiss = randomValue < 0.1;
            }
            else if (staminaValue > 30 && staminaValue <= 50)
            {
                hitMiss = randomValue < 0.3;
            }
            else if (staminaValue > 10 && staminaValue <= 30)
            {
                hitMiss = randomValue < 0.4;
            }
            else if (staminaValue > 5 && staminaValue <= 10)
            {
                hitMiss = randomValue < 0.6;
            }
            else if (staminaValue <= 5)
            {
                hitMiss = true;
            }
            return hitMiss;
        }
    }

}

