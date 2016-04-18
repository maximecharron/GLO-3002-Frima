using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.DTOs.Outbound
{
    [Serializable]
    public class KeepAliveDTO : CommandDTO
    {
        public const string COMMAND_NAME = "keepAlive";
        public Command command = new Command();

        [Serializable]
        public class Command
        {
            public String name = COMMAND_NAME;
        }
    }
}
