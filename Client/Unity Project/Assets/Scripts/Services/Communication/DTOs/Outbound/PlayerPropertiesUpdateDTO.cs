﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.Communication.DTOs.Outbound
{
    [Serializable]
    public class PlayerPropertiesUpdateDTO : CommandDTO
    {
        public const string COMMAND_NAME = "updateUserLevel";
        public Command command = new Command();

        public PlayerPropertiesUpdateDTO(Int32 currentExperiencePoints, Int32 currentLevel, Int32 staminaPowerLevelUpgrade, Int32 hypePowerLevelUpgrade, Int32 attackPowerLevelUpgrade)
        {
            command.parameters.currentXP = currentExperiencePoints;
            command.parameters.currentLevel = currentLevel;
            command.parameters.stamina = staminaPowerLevelUpgrade;
            command.parameters.hype = hypePowerLevelUpgrade;
            command.parameters.attack = attackPowerLevelUpgrade;
        }

        [Serializable]
        public class Command
        {
            public string name = COMMAND_NAME;
            public Parameters parameters = new Parameters();

            [Serializable]
            public class Parameters
            {
                public Int32 currentXP = 0;
                public Int32 currentLevel = 0;
                public Int32 stamina = 0;
                public Int32 hype = 0;
                public Int32 attack = 0;
            }
        }
    }
}