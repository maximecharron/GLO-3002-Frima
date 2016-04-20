using Assets.Scripts.Services.LootItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.LootItems
{
    class LootItemSelectionItemController : MonoBehaviour
    {
        //Configurable script parameters
        public Image ItemIcon;
        public Text PowerValueText;
        public Text EffectDurationValueText;

        public delegate void LootItemClickEventHandler(LootItem lootItem);
        public event LootItemClickEventHandler OnLootItemClick = delegate { };

        private LootItem lootItem;

        public void ShowItem(LootItem lootItem)
        {
            this.lootItem = lootItem;
            EffectDurationValueText.text = lootItem.EffectDuration.TotalSeconds.ToString();
            PowerValueText.text = lootItem.PowerValue.ToString();
            ItemIcon.sprite = lootItem.IconSprite;
            this.gameObject.SetActive(true);
        }

        public void OnLootItemClicked()
        {
            OnLootItemClick(lootItem);
        }
    }
}
