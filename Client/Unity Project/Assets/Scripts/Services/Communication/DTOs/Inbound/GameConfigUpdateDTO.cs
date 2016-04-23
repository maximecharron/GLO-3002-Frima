using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.Communication.DTOs.Inbound
{
    [Serializable]
    public class GameConfigUpdateDTO : CommandDTO
    {
        public const string COMMAND_NAME = "gameConfigUpdate";
        public Command command = new Command();

        [Serializable]
        public class Command
        {
            public string name = COMMAND_NAME;
            public Parameters parameters = new Parameters();

            [Serializable]
            public class Parameters
            {
                public int baseAttackDamage = 0;
                public int hypeAttackDamage = 0;
                public int baseExperienceIncreaseOnHit = 0;
                public int maximumLevel = 0;
                public List<ComboHitSequenceDTO> comboHitSequences = new List<ComboHitSequenceDTO>();
            }
        }
    }
}
