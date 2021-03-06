﻿using Assets.Scripts.Extensions;
using Assets.Scripts.Services.LootItems;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.LootItems
{
    public class LootItemSelectionController : MonoBehaviour
    {
        //Configurable script properties
        public GameObject LootItemGroupTemplate;
        public Text SelectionTitleText;

        public delegate void LootItemSelectedClickEventHandler(LootItem lootItem);
        public event LootItemSelectedClickEventHandler OnLootItemSelected = delegate { };

        private List<GameObject> lootItemGameObjects = new List<GameObject>();

        void Start()
        {
            HideSelectionPanel();
            LootItemGroupTemplate.SetActive(false);
        }

        void Update()
        {
            if (this.gameObject.IsMouseDownOutside())
            {
                HideSelectionPanel();
            }
        }

        public void ShowSelectionPanel(List<LootItem> lootItems, string selectionTitle)
        {
            SelectionTitleText.text = selectionTitle;
            IEnumerable<IGrouping <string, LootItem>> lootItemGroups = lootItems.GroupBy(lootItem => lootItem.Name)
                .OrderBy(lootItemGroup => lootItemGroup.FirstElement().PowerValue);
            foreach (IGrouping<string, LootItem> lootItemGroup in lootItemGroups)
            {
                ShowItemGroup(lootItemGroup);
            }
            this.gameObject.SetActive(true);
        }

        private void ShowItemGroup(IGrouping<string, LootItem> lootItemGroup)
        {
            GameObject lootItemGameObject = LootItemGroupTemplate.Clone();
            lootItemGameObjects.Add(lootItemGameObject);
            LootItemSelectionGroupController lootItemSelectionGroupController = lootItemGameObject.GetComponent<LootItemSelectionGroupController>();
            lootItemSelectionGroupController.OnLootItemGroupSelected += LootItemGroupSelectedEventHandler;
            lootItemSelectionGroupController.ShowItemGroup(lootItemGroup);
        }

        private void HideSelectionPanel()
        {
            this.gameObject.SetActive(false);
            ClearItems();
        }

        private void ClearItems()
        {
            foreach(GameObject lootItemGameObject in lootItemGameObjects)
            {
                DestroyObject(lootItemGameObject);
            }
        }

        private void LootItemGroupSelectedEventHandler(IGrouping<string, LootItem> lootItemGroup)
        {
            HideSelectionPanel();
            OnLootItemSelected(lootItemGroup.FirstElement());
        }
    }
}
