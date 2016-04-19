using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.LootItems
{
    public class LootItem
    {
        public LootItemType ItemType { get { return itemType; } }
        protected LootItemType itemType;
        public LootItemSubType ItemSubType { get { return itemSubType; } }
        protected LootItemSubType itemSubType;
        public string Name { get { return name; } }
        private string name;

        public LootItem(string name)
        {
            this.name = name;
        }
    }
}
