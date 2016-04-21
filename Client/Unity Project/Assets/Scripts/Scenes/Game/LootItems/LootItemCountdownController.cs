using Assets.Scripts.Extensions;
using Assets.Scripts.Services.LootItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.LootItems
{
    public class LootItemCountdownController : MonoBehaviour
    {
        private static Color originalColor = new Color(1f, 0f, 0f);
        private static Color flashColor = new Color(1f, 1f, 1f);
        private const int FLASH_TRIGGER_TIME = 5;
        private const float FLASH_INTERVAL_SECONDS = 0.5f;

        //Configurable script parameters
        public Image LootItemIcon;
        public Text RemainingEffectTimeText;

        private float lastFlashTimeDelta = 0;
        private LootItem currentLootItem;

        void Start()
        {
            this.gameObject.SetActive(false);
        }

        void Update()
        {
            if (currentLootItem != null)
            {
                UpdateRemainingEffectTime(currentLootItem.EffectDuration - new TimeSpan(0, 0, (int)currentLootItem.UsageStartTimeDelta));
                FlashCountdownText();
                currentLootItem.UsageStartTimeDelta += Time.deltaTime;
            }
        }

        private void FlashCountdownText()
        {
            lastFlashTimeDelta += Time.deltaTime;
            if (currentLootItem.EffectDuration.TotalSeconds - currentLootItem.UsageStartTimeDelta < FLASH_TRIGGER_TIME && lastFlashTimeDelta > FLASH_INTERVAL_SECONDS)
            {
                lastFlashTimeDelta = 0;
                AlternateTextColor();
            }
        }

        private void AlternateTextColor()
        {
            RemainingEffectTimeText.color = RemainingEffectTimeText.color.Equals(flashColor) ? originalColor : flashColor;
        }

        void OnDestroy()
        {
            if (currentLootItem != null) {
                currentLootItem.OnEffectExpired -= LootItemEffectExpiredEventHandler;
            }
        }

        public void StartCountdown(LootItem lootItem)
        {
            currentLootItem = lootItem;
            currentLootItem.OnEffectExpired += LootItemEffectExpiredEventHandler;
            LootItemIcon.sprite = lootItem.IconSprite;
            UpdateRemainingEffectTime(lootItem.EffectDuration);
            this.gameObject.SetActive(true);
        }
        
        public void LootItemEffectExpiredEventHandler(LootItem lootItem)
        {
            currentLootItem.OnEffectExpired -= LootItemEffectExpiredEventHandler;
            currentLootItem = null;
            this.gameObject.SetActive(false);
        }

        private void UpdateRemainingEffectTime(TimeSpan remainingEffectTime)
        {
            RemainingEffectTimeText.text = remainingEffectTime.FormatToSimpleSeconds();
        }
    }
}
