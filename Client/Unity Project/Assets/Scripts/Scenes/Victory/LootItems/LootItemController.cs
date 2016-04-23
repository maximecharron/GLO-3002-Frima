using Assets.Scripts.Extensions;
using Assets.Scripts.Services.LootItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Scenes.Victory.LootItems
{
    class LootItemController : MonoBehaviour
    {
        //Configurable script parameters
        public GameObject lootItemGroupTemplate;

        private LootItemService lootItemsService;

        void Start()
        {
            lootItemsService = FindObjectOfType<LootItemService>();
            lootItemGroupTemplate.SetActive(false);
            ShowWonLootItems(lootItemsService.RecentlyWonLootItems);
        }

        private void ShowWonLootItems(List<LootItem> lootItems)
        {
            IEnumerable<IGrouping<string, LootItem>> lootItemGroups = lootItems.GroupBy(lootItem => lootItem.Name);
            foreach (IGrouping<string, LootItem> lootItemGroup in lootItemGroups)
            {
                GameObject lootItemGameObject = lootItemGroupTemplate.Clone();
                LootItemViewGroupController lootItemViewItemController = lootItemGameObject.GetComponent<LootItemViewGroupController>();
                lootItemViewItemController.ShowItem(lootItemGroup);
            }
        }

    }
}
