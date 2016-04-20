using Assets.Scripts.Services.Communication;
using Assets.Scripts.Services.Communication.DTOs;
using Assets.Scripts.Services.Communication.DTOs.Inbound;
using Assets.Scripts.Services.LootItems.Items;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.LootItems
{
    class LootItemService : MonoSingleton
    {
        private WebSocketService webSocketService;
        private LoginService loginService;
        private LootItemFactory lootItemFactory;
        public List<LootItem> LootItems { get { return lootItems; } }
        private List<LootItem> lootItems;
        public List<LootItem> RecentlyWonLootItems { get { return recentlyWonLootItems; } }
        private List<LootItem> recentlyWonLootItems;

        void Start()
        {
            loginService = FindObjectOfType<LoginService>();
            loginService.OnLoginSuccess += LoginSuccessEventHandler;
            webSocketService = FindObjectOfType<WebSocketService>();
            webSocketService.RegisterCommand(LootItemsDTO.COMMAND_NAME, LootItemsCallback, typeof(LootItemsDTO));
            lootItemFactory = new LootItemFactory();
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
                LootItem lootItem = lootItemFactory.Create(lootItemDTO);
                lootItems.Add(lootItem);
                recentlyWonLootItems.Add(lootItem);
            }
        }

        public void UseLootItem(LootItem lootItem)
        {
            LootItemDTO lootItemDTO = new LootItemDTO((int)lootItem.ItemType, (int)lootItem.ItemSubType, lootItem.Name, 1);
            lootItems.Remove(lootItem);
        }
    }
}
