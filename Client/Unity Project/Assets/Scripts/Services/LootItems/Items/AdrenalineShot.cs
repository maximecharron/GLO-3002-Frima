using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.LootItems
{
    public class AdrenalineShot : Consumable
    {
        public int HypeGenerationValue { get { return hypeGenerationValue; } }
        private int hypeGenerationValue;

        public AdrenalineShot(string name, int hypeGenerationValue, int effectDuration) 
            : base(name, effectDuration)
        {
            itemSubType = LootItemSubType.ADRENALINE_SHOT;
            this.hypeGenerationValue = hypeGenerationValue;
        }
    }
}
