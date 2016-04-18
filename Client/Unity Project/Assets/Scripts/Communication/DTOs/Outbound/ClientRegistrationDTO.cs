﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.DTOs.Outbound
{
    [Serializable]
    public class ClientRegistrationDTO : CommandDTO
    {
        public const string COMMAND_NAME = "registerClient";
        public Command command = new Command();

        public ClientRegistrationDTO(string token)
        {
            this.command.parameters.token = token;
        }

        [Serializable]
        public class Command
        {
            public string name = COMMAND_NAME;
            public Parameters parameters = new Parameters();

            [Serializable]
            public class Parameters
            {
                public string token = "";
            }
        }
    }
}
