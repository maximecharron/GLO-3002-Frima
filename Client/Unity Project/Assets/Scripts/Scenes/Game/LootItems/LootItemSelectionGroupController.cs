using Assets.Scripts.Services.LootItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.LootItems
{
    class LootItemSelectionGroupController : MonoBehaviour
    {
        //Configurable script parameters
        public Image ItemGroupIcon;
        public Text GroupCountText;
        public Text PowerValueText;
        public Text EffectDurationValueText;

        public delegate void LootItemGroupSelectedEventHandler(IGrouping<string, LootItem> lootItem);
        public event LootItemGroupSelectedEventHandler OnLootItemGroupSelected = delegate { };

        private IGrouping<string, LootItem> lootItemGroup;

        public void ShowItemGroup(IGrouping<string, LootItem> lootItemGroup)
        {
            this.lootItemGroup = lootItemGroup;
            GroupCountText.text = lootItemGroup.Count().ToString();
            LootItem lootItemSample = lootItemGroup.ElementAt(0);
            EffectDurationValueText.text = lootItemSample.EffectDuration.TotalSeconds.ToString();
            PowerValueText.text = lootItemSample.PowerValue.ToString();
            ItemGroupIcon.sprite = lootItemSample.IconSprite;
            this.gameObject.SetActive(true);
        }

        public void OnLootItemGroupClick()
        {
            OnLootItemGroupSelected(lootItemGroup);
        }
    }
}
