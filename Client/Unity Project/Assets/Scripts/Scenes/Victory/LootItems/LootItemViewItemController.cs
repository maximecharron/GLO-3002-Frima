using Assets.Scripts.Services.LootItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Victory.LootItems
{
    class LootItemViewItemController : MonoBehaviour
    {
        //Configurable script parameters
        public Text ItemNameText;
        public Image ItemIcon;

        public void ShowItem(LootItem lootItem)
        {
            ItemNameText.text = lootItem.Name;
            ItemIcon.sprite = lootItem.IconSprite;
            this.gameObject.SetActive(true);
        }
    }
}
