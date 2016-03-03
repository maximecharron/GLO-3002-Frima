using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts
{
    [Serializable]
    public class BossStatusUpdateCommandDTO : CommandDTO
    {
        public BossStatusUpdateCommand command = new BossStatusUpdateCommand();

        [Serializable]
        public class BossStatusUpdateCommand
        {
            public String name = "bossStatusUpdate";
            public BossStatusUpdateParameters parameters = new BossStatusUpdateParameters();

            [Serializable]
            public class BossStatusUpdateParameters
            {
                public String bossName = "";
                public Int64 currentBossLife = 10000;
                public Int64 constantBossLife = 10000;
                public String status = "ALIVE";
            }
        }

        public override object GetParameters()
        {
            return command.parameters;
        }
    }
}
