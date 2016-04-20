using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.LootItems
{
    public class ProteinShake : Consumable
    {
        public int StaminaPowerValue { get { return staminaPowerValue; } }
        private int staminaPowerValue;

        public override int PowerValue { get { return staminaPowerValue; } }

        public ProteinShake(string name, int staminaPowerValue, TimeSpan effectDuration) 
            : base(name, "Textures/ProteinShake", effectDuration)
        {
            itemSubType = LootItemSubType.PROTEIN_SHAKE;
            this.staminaPowerValue = staminaPowerValue;
        }
    }
}
