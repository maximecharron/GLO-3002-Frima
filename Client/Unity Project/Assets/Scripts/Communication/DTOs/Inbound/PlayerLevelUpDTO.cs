﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.DTOs.Inbound
{
    [Serializable]
    public class PlayerLevelUpDTO : CommandDTO
    {
        public const string COMMAND_NAME = "userLevelUpInformation";
        public Command command = new Command();

        [Serializable]
        public class Command
        {
            public string name = COMMAND_NAME;
            public Parameters parameters = new Parameters();

            [Serializable]
            public class Parameters
            {
                public Int32 pointForNextLevel = 0;
                public Int32 nextLevelXp = 0;
            }
        }
    }
}
