using System;
using UnityEngine;

namespace Assets.Scripts.Services.LootItems
{
    public class ProteinShake : Consumable
    {
        public int StaminaPowerValue { get { return staminaPowerValue; } }
        private int staminaPowerValue;

        public override int PowerValue { get { return staminaPowerValue; } }

        public ProteinShake(string name, Sprite iconSprite, int staminaPowerValue, TimeSpan effectDuration) 
            : base(name, iconSprite, effectDuration)
        {
            itemSubType = LootItemSubType.PROTEIN_SHAKE;
            this.staminaPowerValue = staminaPowerValue;
        }
    }
}
