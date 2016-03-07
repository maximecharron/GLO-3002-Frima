using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.CommandDTOs
{
    [Serializable]
    public class KeepAliveCommandDTO : CommandDTO
    {
        public const string COMMAND_NAME = "keepAlive";
        public KeepAliveCommand command = new KeepAliveCommand();

        [Serializable]
        public class KeepAliveCommand
        {
            public String name = COMMAND_NAME;
        }
    }
}
