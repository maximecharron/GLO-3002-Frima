using System;
using System.Collections.Generic;

namespace Assets.Scripts.Services.Communication.DTOs.Outbound
{
    [Serializable]
    public class LootItemUsageDTO : CommandDTO
    {
        public const string COMMAND_NAME = "useItems";
        public Command command = new Command();

        public LootItemUsageDTO(List<LootItemDTO> items)
        {
            command.parameters.items = items;
        }

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
