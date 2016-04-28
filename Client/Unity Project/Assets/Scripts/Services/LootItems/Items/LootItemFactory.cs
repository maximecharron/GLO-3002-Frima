using Assets.Scripts.Services.Communication.DTOs;
using System;
using UnityEngine;

namespace Assets.Scripts.Services.LootItems.Items
{
    public class LootItemFactory : MonoBehaviour
    {
        //Configurable script parameters
        public Sprite ProteinShakeSprite;
        public Sprite AdrenalineShotSprite;

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
                return new ProteinShake(lootItemDTO.name, ProteinShakeSprite, lootItemDTO.staminaRegeneration, new TimeSpan(0, 0, lootItemDTO.effectDuration));
            }
            else if ((LootItemSubType)lootItemDTO.subType == LootItemSubType.ADRENALINE_SHOT)
            {
                return new AdrenalineShot(lootItemDTO.name, AdrenalineShotSprite, lootItemDTO.hypeGeneration, new TimeSpan(0, 0, lootItemDTO.effectDuration));
            }
            else
            {
                throw new NotSupportedException(String.Format("Item subtype {0} is not currently supported.", lootItemDTO.subType));
            }
        }
    }
}
