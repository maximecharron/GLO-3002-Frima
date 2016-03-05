using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.CommandDTOs
{
    [Serializable]
    public class BossAttackCommandDTO : CommandDTO
    {
        public BossAttackCommand command = new BossAttackCommand();

        public BossAttackCommandDTO(Int64 number)
        {
            this.command.parameters.number = number;
        }

        [Serializable]
        public class BossAttackCommand
        {
            public String name = "attack";
            public BossAttackParameters parameters = new BossAttackParameters();

            [Serializable]
            public class BossAttackParameters
            {
                public Int64 number = 10;
            }
        }
    }
}
