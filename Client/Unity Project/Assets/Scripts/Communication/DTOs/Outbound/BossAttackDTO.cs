using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.DTOs.Outbound
{
    [Serializable]
    public class BossAttackDTO : CommandDTO
    {
        public const string COMMAND_NAME = "attack";
        public Command command = new Command();

        public BossAttackDTO(Int32 number)
        {
            this.command.parameters.number = number;
        }

        [Serializable]
        public class Command
        {
            public String name = COMMAND_NAME;
            public Parameters parameters = new Parameters();

            [Serializable]
            public class Parameters
            {
                public Int32 number = 10;
            }
        }
    }
}
