using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.CommandDTOs
{
    [Serializable]
    public class CommandDefinitionDTO
    {
        public CommandDefinition command = new CommandDefinition();

        [Serializable]
        public class CommandDefinition
        {
            public String name;
        }
    }
}
