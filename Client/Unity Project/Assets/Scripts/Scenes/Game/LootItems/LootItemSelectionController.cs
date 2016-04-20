using Assets.Scripts.Extensions;
using Assets.Scripts.Services.LootItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game.LootItems
{
    public class LootItemSelectionController : MonoBehaviour
    {
        //Configurable script properties
        public GameObject LootItemTemplate;
        public Text SelectionTitleText;

        public delegate void LootItemSelectedClickEventHandler(LootItem lootItem);
        public event LootItemSelectedClickEventHandler OnLootItemSelected = delegate { };

        private List<GameObject> lootItemGameObjects = new List<GameObject>();

        void Start()
        {
            LootItemTemplate.SetActive(false);
        }

        void Update()
        {
            if (this.gameObject.IsMouseDownOutside())
            {
                this.gameObject.SetActive(false);
                ClearItems();
            }
        }

        public void ShowSelectionPanel(List<LootItem> lootItems, string selectionTitle)
        {
            SelectionTitleText.text = selectionTitle;
            foreach (LootItem lootItem in lootItems)
            {
                GameObject lootItemGameObject = LootItemTemplate.Clone();
                lootItemGameObjects.Add(lootItemGameObject);
                LootItemSelectionItemController lootItemSelectionItem = lootItemGameObject.GetComponent<LootItemSelectionItemController>();
                lootItemSelectionItem.OnLootItemClick += LootItemClickEventHandler;
                lootItemSelectionItem.ShowItem(lootItem);
            }
            this.gameObject.SetActive(true);
        }

        private void ClearItems()
        {
            foreach(GameObject lootItemGameObject in lootItemGameObjects)
            {
                DestroyObject(lootItemGameObject);
            }
        }

        private void LootItemClickEventHandler(LootItem lootItem)
        {
            OnLootItemSelected(lootItem);
        }
    }
}
