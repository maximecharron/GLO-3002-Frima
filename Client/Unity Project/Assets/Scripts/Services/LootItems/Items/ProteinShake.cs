using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.LootItems
{
    public class ProteinShake : Consumable
    {
        public int StaminaRegenerationValue { get { return staminaRegenerationValue; } }
        private int staminaRegenerationValue;

        public ProteinShake(string name, int staminaRegenerationValue, int effectDuration) 
            : base(name, effectDuration)
        {
            itemSubType = LootItemSubType.PROTEIN_SHAKE;
            this.staminaRegenerationValue = staminaRegenerationValue;
        }
    }
}
