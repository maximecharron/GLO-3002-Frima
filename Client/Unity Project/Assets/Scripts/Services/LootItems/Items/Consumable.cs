using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.LootItems
{
    public class Consumable : LootItem
    {
        public int EffectDuration { get { return effectDuration; } }
        private int effectDuration;

        public Consumable(string name, int effectDuration) 
            : base(name)
        {
            itemType = LootItemType.CONSUMABLE;
            this.effectDuration = effectDuration;
        }

    }
}
