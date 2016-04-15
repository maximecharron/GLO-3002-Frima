using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.CommandDTOs
{
    [Serializable]
    public class BossStatusUpdateDTO : CommandDTO
    {
        public const string COMMAND_NAME = "bossStatusUpdate";
        public Command command = new Command();

        [Serializable]
        public class Command
        {
            public String name = COMMAND_NAME;
            public Parameters parameters = new Parameters();

            [Serializable]
            public class Parameters
            {
                public String bossName = "";
                public Int32 currentBossLife = 10000;
                public Int32 maximumBossLife = 10000;
                public Int32 status = 0;
                public long creationDate = 0;
            }
        }
    }
}
