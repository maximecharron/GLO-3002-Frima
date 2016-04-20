using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.LootItems
{
    public abstract class Consumable : LootItem
    {
        public Consumable(string name, string iconName, TimeSpan effectDuration) 
            : base(name, iconName, effectDuration)
        {
            itemType = LootItemType.CONSUMABLE;
        }

    }
}
