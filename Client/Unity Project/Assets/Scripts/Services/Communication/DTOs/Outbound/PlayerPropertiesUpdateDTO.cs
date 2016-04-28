using System;

namespace Assets.Scripts.Services.Communication.DTOs.Outbound
{
    [Serializable]
    public class PlayerPropertiesUpdateDTO : CommandDTO
    {
        public const string COMMAND_NAME = "updateUserLevel";
        public Command command = new Command();

        public PlayerPropertiesUpdateDTO(Int32 experiencePoints, Int32 currentLevel, Int32 staminaPowerLevelUpgrade, Int32 hypePowerLevelUpgrade, Int32 attackPowerLevelUpgrade)
        {
            command.parameters.experiencePoints = experiencePoints;
            command.parameters.level = currentLevel;
            command.parameters.staminaPowerLevelUpgrade = staminaPowerLevelUpgrade;
            command.parameters.hypePowerLevelUpgrade = hypePowerLevelUpgrade;
            command.parameters.attackPowerLevelUpgrade = attackPowerLevelUpgrade;
        }

        [Serializable]
        public class Command
        {
            public string name = COMMAND_NAME;
            public Parameters parameters = new Parameters();

            [Serializable]
            public class Parameters
            {
                public int experiencePoints = 0;
                public int level = 0;
                public int staminaPowerLevelUpgrade = 0;
                public int hypePowerLevelUpgrade = 0;
                public int attackPowerLevelUpgrade = 0;
            }
        }
    }
}
