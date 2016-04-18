using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.DTOs.Inbound
{
    [Serializable]
    public class BossStatusUpdateDTO : CommandDTO
    {
        public const string COMMAND_NAME = "bossStatusUpdate";
        public Command command = new Command();

        [Serializable]
        public class Command
        {
            public string name = COMMAND_NAME;
            public Parameters parameters = new Parameters();

            [Serializable]
            public class Parameters
            {
                public string bossName = "";
                public long currentBossLife = 10000;
                public long maximumBossLife = 10000;
                public int status = 0;
                public long creationDate = 0;
            }
        }
    }
}
