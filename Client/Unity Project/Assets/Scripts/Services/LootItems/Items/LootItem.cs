using System;
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
        public float UsageStartTimeDelta { get { return usageStartTimeDelta; } set { UpdateUsageStartTimeDelta(value); } }
        private float usageStartTimeDelta = 0;

        public delegate void EffectExpiredEventHandler(LootItem lootItem);
        public event EffectExpiredEventHandler OnEffectExpired = delegate { };

        public abstract int PowerValue { get; }

        public LootItem(string name, Sprite iconSprite, TimeSpan effectDuration)
        {
            this.name = name;
            this.iconSprite = iconSprite;
            this.effectDuration = effectDuration;
        }

        private void UpdateUsageStartTimeDelta(float value)
        {
            usageStartTimeDelta = value;
            if (usageStartTimeDelta > effectDuration.TotalSeconds)
            {
                OnEffectExpired(this);
            }
        }
    }
}
