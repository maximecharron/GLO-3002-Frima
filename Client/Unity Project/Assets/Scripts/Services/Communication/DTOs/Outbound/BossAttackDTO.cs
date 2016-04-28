using System;

namespace Assets.Scripts.Services.Communication.DTOs.Outbound
{
    [Serializable]
    public class BossAttackDTO : CommandDTO
    {
        public const string COMMAND_NAME = "attack";
        public Command command = new Command();

        public BossAttackDTO(long value)
        {
            command.parameters.value = value;
        }

        [Serializable]
        public class Command
        {
            public string name = COMMAND_NAME;
            public Parameters parameters = new Parameters();

            [Serializable]
            public class Parameters
            {
                public long value = 10;
            }
        }
    }
}
