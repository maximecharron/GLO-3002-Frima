using Assets.Scripts.Services.Communication;
using Assets.Scripts.Services.Communication.DTOs;
using Assets.Scripts.Services.Communication.DTOs.Inbound;
using Assets.Scripts.Services.Communication.DTOs.Outbound;
using Assets.Scripts.Services.LootItems.Items;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Services.LootItems
{
    class LootItemService : MonoSingleton
    {
        //Configurable script parameters
        public LootItemFactory LootItemFactory;

        private WebSocketService webSocketService;
        private LoginService loginService;
        public List<LootItem> LootItems { get { return lootItems; } }
        private List<LootItem> lootItems = new List<LootItem>();
        public List<LootItem> RecentlyWonLootItems { get { return recentlyWonLootItems; } }
        private List<LootItem> recentlyWonLootItems = new List<LootItem>();

        void Start()
        {
            loginService = FindObjectOfType<LoginService>();
            loginService.OnLoginSuccess += LoginSuccessEventHandler;
            webSocketService = FindObjectOfType<WebSocketService>();
            webSocketService.RegisterCommand(LootItemsDTO.COMMAND_NAME, LootItemsCallback, typeof(LootItemsDTO));
        }

        private void LoginSuccessEventHandler(LoginResultDTO loginResultDTO)
        {
            lootItems.Clear();
            AddLootItems(loginResultDTO.items);
            recentlyWonLootItems.Clear();
        }

        private void LootItemsCallback(CommandDTO commandDTO)
        {
            var lootItemsParams = ((LootItemsDTO)commandDTO).command.parameters;
            AddLootItems(lootItemsParams.items);
        }

        private void AddLootItems(List<LootItemDTO> lootItemsDTO)
        {
            recentlyWonLootItems.Clear();
            foreach (LootItemDTO lootItemDTO in lootItemsDTO)
            {
                LootItem lootItem = LootItemFactory.Create(lootItemDTO);
                lootItems.Add(lootItem);
                recentlyWonLootItems.Add(lootItem);
            }
        }

        public void UseLootItem(LootItem lootItem)
        {
            LootItemDTO lootItemDTO = new LootItemDTO((int)lootItem.ItemType, (int)lootItem.ItemSubType, lootItem.Name, 1);
            webSocketService.SendCommand(new LootItemUsageDTO(new List<LootItemDTO>() { lootItemDTO }));
            lootItems.Remove(lootItem);
        }

        public int GetAvailableItemCount(Predicate<LootItem> match)
        {
            return lootItems.FindAll(match).Count;
        }
    }
}
