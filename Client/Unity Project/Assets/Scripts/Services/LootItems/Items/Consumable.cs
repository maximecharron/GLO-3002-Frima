using System;
using UnityEngine;

namespace Assets.Scripts.Services.LootItems
{
    public abstract class Consumable : LootItem
    {
        public Consumable(string name, Sprite iconSprite, TimeSpan effectDuration) 
            : base(name, iconSprite, effectDuration)
        {
            itemType = LootItemType.CONSUMABLE;
        }

    }
}
