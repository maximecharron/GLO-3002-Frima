using System;

namespace Assets.Scripts.Services.Communication.DTOs.Outbound
{
    [Serializable]
    public class KeepAliveDTO : CommandDTO
    {
        public const string COMMAND_NAME = "keepAlive";
        public Command command = new Command();

        [Serializable]
        public class Command
        {
            public string name = COMMAND_NAME;
        }
    }
}
