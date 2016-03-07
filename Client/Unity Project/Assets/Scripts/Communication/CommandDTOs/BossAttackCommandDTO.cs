using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.CommandDTOs
{
    [Serializable]
    public class BossAttackCommandDTO : CommandDTO
    {
        public const string COMMAND_NAME = "attack";
        public BossAttackCommand command = new BossAttackCommand();

        public BossAttackCommandDTO(Int32 number)
        {
            this.command.parameters.number = number;
        }

        [Serializable]
        public class BossAttackCommand
        {
            public String name = COMMAND_NAME;
            public BossAttackParameters parameters = new BossAttackParameters();

            [Serializable]
            public class BossAttackParameters
            {
                public Int32 number = 10;
            }
        }
    }
}
