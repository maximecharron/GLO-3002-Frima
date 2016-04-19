using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.Communication.DTOs
{
    [Serializable]
    public class LootItemDTO
    {
        public LootItemDTO(int type, int subType, string name, int quantity)
        {
            this.type = type;
            this.subType = subType;
            this.name = name;
            this.quantity = quantity;
        }

        public int type = 0;
        public int subType = 0;
        public string name = "";
        public int staminaRegeneration = 0;
        public int hyperGeneration = 0;
        public int effectDuration = 0;
        public int quantity = 0;
    }
}
