using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Services.LootItems
{
    public abstract class LootItem
    {
        public LootItemType ItemType { get { return itemType; } }
        protected LootItemType itemType;
        public LootItemSubType ItemSubType { get { return itemSubType; } }
        protected LootItemSubType itemSubType;
        public string Name { get { return name; } }
        private string name;
        public Sprite IconSprite { get { return iconSprite; } }
        private Sprite iconSprite;
        public TimeSpan EffectDuration { get { return effectDuration; } }
        private TimeSpan effectDuration;

        public abstract int PowerValue { get; }

        public LootItem(string name, Sprite iconSprite, TimeSpan effectDuration)
        {
            this.name = name;
            this.iconSprite = iconSprite;
            this.effectDuration = effectDuration;
        }
    }
}
