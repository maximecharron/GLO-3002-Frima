using System;

namespace Assets.Scripts.Services.Communication.DTOs.Outbound
{
    [Serializable]
    public class ExperiencePointsUpdateDTO : CommandDTO
    {
        public const string COMMAND_NAME = "updateUserExperience";
        public Command command = new Command();

        public ExperiencePointsUpdateDTO(Int32 experiencePoints)
        {
            command.parameters.experiencePoints = experiencePoints;
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
            }
        }
    }
}
