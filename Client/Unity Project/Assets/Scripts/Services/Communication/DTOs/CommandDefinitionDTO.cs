using System;

namespace Assets.Scripts.Services.Communication.DTOs
{
    [Serializable]
    public class CommandDefinitionDTO
    {
        public CommandDefinition command = new CommandDefinition();

        [Serializable]
        public class CommandDefinition
        {
            public string name;
        }
    }
}
