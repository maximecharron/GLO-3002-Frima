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
        private List<LootItem> lootItems;

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
        }

        private void LootItemsCallback(CommandDTO commandDTO)
        {
            var lootItemsParams = ((LootItemsDTO)commandDTO).command.parameters;
            AddLootItems(lootItemsParams.items);
        }

        private void AddLootItems(List<LootItemDTO> lootItemsDTO)
        {
            foreach (LootItemDTO lootItemDTO in lootItemsDTO)
            {
                lootItems.Add(lootItemFactory.Create(lootItemDTO));
            }
        }

        public void UseItem(LootItem lootItem)
        {
            LootItemDTO lootItemDTO = new LootItemDTO((int)lootItem.ItemType, (int)lootItem.ItemSubType, lootItem.Name, 1);
        }
    }
}
