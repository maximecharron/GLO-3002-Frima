using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.LootItems
{
    public class AdrenalineShot : Consumable
    {
        public int HypePowerValue { get { return hypePowerValue; } }
        private int hypePowerValue;

        public override int PowerValue { get { return hypePowerValue; } }

        public AdrenalineShot(string name, int hypePowerValue, TimeSpan effectDuration) 
            : base(name, "Textures/AdrenalineShot", effectDuration)
        {
            itemSubType = LootItemSubType.ADRENALINE_SHOT;
            this.hypePowerValue = hypePowerValue;
        }
    }
}
