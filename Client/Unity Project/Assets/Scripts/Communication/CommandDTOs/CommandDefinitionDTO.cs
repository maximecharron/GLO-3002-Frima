using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts
{
    [Serializable]
    public class CommandDefinitionDTO
    {
        public Command command = new Command();

        [Serializable]
        public class Command
        {
            public String name;
        }
    }
}
