using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

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
        public string IconName { get { return iconName; } }
        private string iconName;
        public TimeSpan EffectDuration { get { return effectDuration; } }
        private TimeSpan effectDuration;

        public abstract int PowerValue { get; }

        public LootItem(string name, string iconName, TimeSpan effectDuration)
        {
            this.name = name;
            this.iconName = iconName;
            this.effectDuration = effectDuration;
        }
    }
}
