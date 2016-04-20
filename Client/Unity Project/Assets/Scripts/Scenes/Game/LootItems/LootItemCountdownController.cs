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
        //Configurable script parameters
        public Image LootItemIcon;
        public Text RemainingEffectTimeText;

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
                currentLootItem.UsageStartTimeDelta += Time.deltaTime;
            }
        }

        public void StartCountdown(LootItem lootItem)
        {
            this.currentLootItem = lootItem;
            lootItem.OnEffectExpired += LootItemEffectExpiredEventHandler;
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
            int minutes = (int)Math.Floor(Math.Abs(remainingEffectTime.TotalSeconds) % 3600 / 60);
            int seconds = (int)Math.Floor(Math.Abs(remainingEffectTime.TotalSeconds) % 3600 % 60);
            RemainingEffectTimeText.text = String.Format("{0}:{1:D2}", minutes, seconds);
        }
    }
}
