using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.CommandDTOs
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
                public Int32 currentBossLife = 10000;
                public Int32 constantBossLife = 10000;
                public Int32 status = 0;
            }
        }
    }
}
