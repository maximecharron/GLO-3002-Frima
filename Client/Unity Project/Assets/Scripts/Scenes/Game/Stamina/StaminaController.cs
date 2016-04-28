using Assets.Scripts.Scenes.Game.LootItems;
using Assets.Scripts.Services;
using Assets.Scripts.Services.LootItems;
using System;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.Stamina
{
    public class StaminaController : MonoBehaviour
    {
        private const float BASE_STAMINA_DECREASE_ON_HIT = 5f;
        private const float STAMINA_POWER_BASE = 1.1f;
        private const float STAMINA_RESTORE_VALUE = 0.5f;
        private const float STAMINA_RESTORATION_FREQUENCY_SECONDS = 0.05f;
        private const int STAMINA_HIT_MISS_TRESHOLD = 80;

        //Configurable script parameters
        public StaminaSliderController StaminaSliderController;
        public LootItemController LootItemController;
        public Button proteinShakeButton;
        public Text remainingProteinShakeCountLabel;

        private PlayerPropertyService playerPropertyService;
        private LootItemService lootItemService;
        private float lastStaminaAutoIncreaseTimeDelta = 0;
        private ProteinShake currentProteinShake;

        void Start()
        {
            playerPropertyService = FindObjectOfType<PlayerPropertyService>();
            lootItemService = FindObjectOfType<LootItemService>();
            StaminaSliderController.Value = StaminaSliderController.MaxValue;
            LootItemController.OnLootItemUsed += LootItemUsedEventHandler;
            LootItemController.OnLootItemEffectExpired += LootItemEffectExpiredEventHandler;
            UpdateRemainingProteinShakeCountText();
        }

        void Update()
        {
            lastStaminaAutoIncreaseTimeDelta += Time.deltaTime;
            if (lastStaminaAutoIncreaseTimeDelta > STAMINA_RESTORATION_FREQUENCY_SECONDS)
            {
                AutoIncreaseStamina();
                lastStaminaAutoIncreaseTimeDelta = 0;
            }
        }

        public void DecreaseStamina()
        {
            float proteinShakePowerValue = currentProteinShake != null ? currentProteinShake.StaminaPowerValue : 1;
            StaminaSliderController.Value -= BASE_STAMINA_DECREASE_ON_HIT / Mathf.Pow(STAMINA_POWER_BASE, playerPropertyService.StaminaPowerLevel + proteinShakePowerValue);
        }

        private void AutoIncreaseStamina()
        {
            StaminaSliderController.Value = Math.Min(StaminaSliderController.Value + STAMINA_RESTORE_VALUE, StaminaSliderController.MaxValue);
        }

        public bool IsHitMiss()
        {
            return UnityEngine.Random.value < (STAMINA_HIT_MISS_TRESHOLD - StaminaSliderController.Value) / 100;
        }

        public void OnProteinShakeButtonClick()
        {
            LootItemController.PickItem(lootItem => lootItem.ItemSubType == LootItemSubType.PROTEIN_SHAKE, "Protein Shakes");
        }

        private void LootItemUsedEventHandler(LootItem lootItem)
        {
            if (lootItem.ItemSubType == LootItemSubType.PROTEIN_SHAKE)
            {
                currentProteinShake = (ProteinShake)lootItem;
                UpdateRemainingProteinShakeCountText();
            }
            proteinShakeButton.interactable = false;
        }

        private void LootItemEffectExpiredEventHandler(LootItem lootItem)
        {
            currentProteinShake = null;
            proteinShakeButton.interactable = true;
        }

        private void UpdateRemainingProteinShakeCountText()
        {
            int proteinShakeCount = lootItemService.GetAvailableItemCount(lootItem => lootItem.ItemSubType == LootItemSubType.PROTEIN_SHAKE);
            remainingProteinShakeCountLabel.text = String.Format("x{0}", proteinShakeCount);
        }
    }

}

