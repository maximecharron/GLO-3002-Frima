using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.Communication.DTOs.Inbound
{
    [Serializable]
    public class GameConfigUpdateDTO : CommandDTO
    {
        public const string COMMAND_NAME = "gameStatusUpdate";
        public Command command = new Command();

        [Serializable]
        public class Command
        {
            public string name = COMMAND_NAME;
            public Parameters parameters = new Parameters();

            [Serializable]
            public class Parameters
            {
                public Int32 baseDamage = 0;
            }
        }
    }
}
