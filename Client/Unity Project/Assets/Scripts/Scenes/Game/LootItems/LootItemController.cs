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
        public LootItemInUseDisplayController LootItemInUseDisplayController;
        public LootItemSelectionController LootItemSelectionController;

        public delegate void LootItemUsedClickEventHandler(LootItem lootItem);
        public event LootItemUsedClickEventHandler OnLootItemUsed = delegate { };
        public delegate void LootItemEffectExpiredEventHandler(LootItem lootItem);
        public event LootItemEffectExpiredEventHandler OnLootItemEffectExpired = delegate { };

        public LootItem CurrentLootItem { get { return currentLootItem; } }
        private LootItem currentLootItem;
        private DateTime lootItemUsageStartTime;
        private LootItemService lootItemService;

        void Start()
        {
            lootItemService = FindObjectOfType<LootItemService>();
            LootItemSelectionController.OnLootItemSelected += LootItemSelectedEventHandler;
        }

        void OnDestroy()
        {
            CancelInvoke();
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

        public List<LootItem> GetAvailableItems(Predicate<LootItem> match)
        {
            return lootItemService.LootItems.FindAll(match); ;
        }

        private void LootItemSelectedEventHandler(LootItem lootItem)
        {
            UseItem(lootItem);
        }

        private void UseItem(LootItem lootItem)
        {
            currentLootItem = lootItem;
            lootItemService.UseLootItem(currentLootItem);
            LootItemInUseDisplayController.DisplayLootItemInUse(lootItem);
            lootItemUsageStartTime = DateTime.Now;
            InvokeRepeating("LootItemCountDown", 1, 1);
            OnLootItemUsed(lootItem);
        }

        public void LootItemCountDown()
        {
            if (DateTime.Now - lootItemUsageStartTime > currentLootItem.EffectDuration)
            {
                ProcessLootItemExpired();
            }
            else {
                LootItemInUseDisplayController.UpdateRemainingEffectTime(currentLootItem.EffectDuration - (DateTime.Now - lootItemUsageStartTime));
            }
        }

        private void ProcessLootItemExpired()
        {
            CancelInvoke();
            LootItemInUseDisplayController.HideLootItemInUse();
            OnLootItemEffectExpired(currentLootItem);
            currentLootItem = null;
        }

    }
}
