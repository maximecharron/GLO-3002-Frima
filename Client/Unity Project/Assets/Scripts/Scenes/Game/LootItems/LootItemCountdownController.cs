using Assets.Scripts.Animation.DualStateAnimation;
using Assets.Scripts.Extensions;
using Assets.Scripts.Services.LootItems;
using System;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.LootItems
{
    public class LootItemCountdownController : MonoBehaviour
    {
        //Configurable script parameters
        public Image LootItemIcon;
        public Text RemainingEffectTimeText;
        public int FlashTriggerTime = 5;

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
                RemainingEffectTimeText.GetComponent<TextColorAnimator>().Enabled = currentLootItem.EffectDuration.TotalSeconds - currentLootItem.UsageStartTimeDelta < FlashTriggerTime;
                currentLootItem.UsageStartTimeDelta += Time.deltaTime;
            }
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
