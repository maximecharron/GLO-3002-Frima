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
        public GameObject lootItemTemplate;

        private LootItemService lootItemsService;

        void Start()
        {
            lootItemsService = FindObjectOfType<LootItemService>();
            lootItemTemplate.SetActive(false);
            ShowWonLootItems(lootItemsService.RecentlyWonLootItems);
        }

        private void ShowWonLootItems(List<LootItem> lootItems)
        {
            foreach (LootItem lootItem in lootItems)
            {
                GameObject lootItemGameObject = lootItemTemplate.Clone();
                LootItemViewItemController lootItemViewItemController = lootItemGameObject.GetComponent<LootItemViewItemController>();
                lootItemViewItemController.ShowItem(lootItem);
            }
        }

    }
}
