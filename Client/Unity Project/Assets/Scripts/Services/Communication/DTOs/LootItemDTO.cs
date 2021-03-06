﻿using System;

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
        public int hypeGeneration = 0;
        public int effectDuration = 0;
        public int quantity = 1;
    }
}
