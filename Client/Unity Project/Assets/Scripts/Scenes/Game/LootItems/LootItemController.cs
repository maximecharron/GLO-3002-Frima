using Assets.Scripts.Extensions;
using Assets.Scripts.Services.LootItems;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Scenes.Game.LootItems
{
    public class LootItemController : MonoBehaviour
    {
        //Configurable script parameters
        public LootItemCountdownController LootItemCountdownController;
        public LootItemSelectionController LootItemSelectionController;
        public AudioClip LootItemUsedAudioClip;

        public delegate void LootItemUsedClickEventHandler(LootItem lootItem);
        public event LootItemUsedClickEventHandler OnLootItemUsed = delegate { };
        public delegate void LootItemEffectExpiredEventHandler(LootItem lootItem);
        public event LootItemEffectExpiredEventHandler OnLootItemEffectExpired = delegate { };

        public LootItem CurrentLootItem { get { return currentLootItem; } }
        private LootItem currentLootItem;
        private LootItemService lootItemService;

        void Start()
        {
            lootItemService = FindObjectOfType<LootItemService>();
            LootItemSelectionController.OnLootItemSelected += LootItemSelectedEventHandler;
        }

        void OnDestroy()
        {
            LootItemSelectionController.OnLootItemSelected -= LootItemSelectedEventHandler;
            if (currentLootItem != null) {
                currentLootItem.OnEffectExpired -= LootItemExpiredItemExpiredEventHandler;
            }
        }

        public void PickItem(Predicate<LootItem> match, string selectionTitle)
        {
            if (currentLootItem != null)
            {
                return;
            }
            List<LootItem> lootItems = lootItemService.LootItems.FindAll(match);
            if (lootItems.Count == 1)
            {
                UseItem(lootItems[0]);
            }
            else if (lootItems.Count > 1)
            {
                LootItemSelectionController.ShowSelectionPanel(lootItems, selectionTitle);
            }
        }

        private void LootItemSelectedEventHandler(LootItem lootItem)
        {
            UseItem(lootItem);
        }

        private void UseItem(LootItem lootItem)
        {
            currentLootItem = lootItem;
            currentLootItem.OnEffectExpired += LootItemExpiredItemExpiredEventHandler;
            lootItemService.UseLootItem(currentLootItem);
            LootItemCountdownController.StartCountdown(lootItem);
            this.gameObject.FindAudioSource(LootItemUsedAudioClip).Play();
            OnLootItemUsed(lootItem);
        }

        private void LootItemExpiredItemExpiredEventHandler(LootItem lootItem)
        {
            lootItem.OnEffectExpired -= LootItemExpiredItemExpiredEventHandler;
            OnLootItemEffectExpired(currentLootItem);
            currentLootItem = null;
        }

    }
}
