using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Services.LootItems
{
    public class AdrenalineShot : Consumable
    {
        public int HypePowerValue { get { return hypePowerValue; } }
        private int hypePowerValue;

        public override int PowerValue { get { return hypePowerValue; } }

        public AdrenalineShot(string name, Sprite iconSprite, int hypePowerValue, TimeSpan effectDuration) 
            : base(name, iconSprite, effectDuration)
        {
            itemSubType = LootItemSubType.ADRENALINE_SHOT;
            this.hypePowerValue = hypePowerValue;
        }
    }
}
