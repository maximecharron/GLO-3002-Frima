using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.DTOs.Outbound
{
    [Serializable]
    public class ExperiencePointsUpdateDTO : CommandDTO
    {
        public const string COMMAND_NAME = "updateUserExperience";
        public Command command = new Command();

        public ExperiencePointsUpdateDTO(Int32 currentExperiencePoints)
        {
            this.command.parameters.currentXP = currentExperiencePoints;
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
            }
        }
    }
}
