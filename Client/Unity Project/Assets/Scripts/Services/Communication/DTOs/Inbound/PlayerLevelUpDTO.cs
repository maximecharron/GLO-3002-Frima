using System;

namespace Assets.Scripts.Services.Communication.DTOs.Inbound
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
                public Int32 upgradePointsOnLevelComplete = 0;
                public Int32 requiredExperiencePointsForNextLevel = 0;
            }
        }
    }
}
