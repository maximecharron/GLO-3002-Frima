using System;
using System.Collections.Generic;

namespace Assets.Scripts.Services.Communication.DTOs.Inbound
{
    [Serializable]
    public class LootItemsDTO : CommandDTO
    {
        public const string COMMAND_NAME = "lootItems";
        public Command command = new Command();

        [Serializable]
        public class Command
        {
            public string name = COMMAND_NAME;
            public Parameters parameters = new Parameters();

            [Serializable]
            public class Parameters
            {
                public List<LootItemDTO> items = new List<LootItemDTO>();
            }
        }
    }
}
