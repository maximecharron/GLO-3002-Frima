using Assets.Scripts.Services.LootItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.LootItems
{
    public class LootItemInUseDisplayController : MonoBehaviour
    {
        //Configurable script parameters
        public Image LootItemIcon;
        public Text RemainingEffectTimeText;

        public void DisplayLootItemInUse(LootItem lootItem)
        {
            LootItemIcon.sprite = (Sprite)Resources.Load(lootItem.IconName);
            UpdateRemainingEffectTime(lootItem.EffectDuration);
            this.gameObject.SetActive(true);
        }
        
        public void HideLootItemInUse()
        {
            this.gameObject.SetActive(false);
        }

        public void UpdateRemainingEffectTime(TimeSpan remainingEffectTime)
        {
            int minutes = (int)Math.Floor(Math.Abs(remainingEffectTime.TotalSeconds) % 3600 / 60);
            int seconds = (int)Math.Floor(Math.Abs(remainingEffectTime.TotalSeconds) % 3600 % 60);
            RemainingEffectTimeText.text = String.Format("{0}:{1:D2}", minutes, seconds);
        }
    }
}
