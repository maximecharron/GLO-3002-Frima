using Assets.Scripts.Extensions;
using Assets.Scripts.Services.LootItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Victory.LootItems
{
    class LootItemViewGroupController : MonoBehaviour
    {
        //Configurable script parameters
        public Text ItemGroupNameText;
        public Image ItemGroupIcon;
        public Text ItemCountText;

        public void ShowItem(IGrouping<string, LootItem> lootItemGroup)
        {
            ItemCountText.text = String.Format("{0}X", lootItemGroup.Count().ToString());
            LootItem lootItemSample = lootItemGroup.FirstElement();
            ItemGroupNameText.text = lootItemSample.Name;
            ItemGroupIcon.sprite = lootItemSample.IconSprite;
            this.gameObject.SetActive(true);
        }
    }
}
