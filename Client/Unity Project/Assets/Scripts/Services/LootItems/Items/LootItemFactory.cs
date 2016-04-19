using Assets.Scripts.Services.Communication.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.LootItems.Items
{
    public class LootItemFactory
    {
        public LootItem Create(LootItemDTO lootItemDTO)
        {
            if ((LootItemType)lootItemDTO.type == LootItemType.CONSUMABLE)
            {
                return CreateConsumable(lootItemDTO);
            }
            else
            {
                throw new NotSupportedException(String.Format("Item of type {0} is not currently supported.", lootItemDTO.type));
            }
        }

        private Consumable CreateConsumable(LootItemDTO lootItemDTO)
        {
            if ((LootItemSubType)lootItemDTO.subType == LootItemSubType.PROTEIN_SHAKE)
            {
                return new ProteinShake(lootItemDTO.name, lootItemDTO.staminaRegeneration, lootItemDTO.effectDuration);
            }
            else if ((LootItemSubType)lootItemDTO.subType == LootItemSubType.ADRENALINE_SHOT)
            {
                return new AdrenalineShot(lootItemDTO.name, lootItemDTO.hyperGeneration, lootItemDTO.effectDuration);
            }
            else
            {
                throw new NotSupportedException(String.Format("Item subtype {0} is not currently supported.", lootItemDTO.subType));
            }
        }
    }
}
