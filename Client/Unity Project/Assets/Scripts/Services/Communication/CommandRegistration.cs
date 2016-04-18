using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Assets.Scripts.Services.Communication.DTOs;

namespace Assets.Scripts.Services.Communication
{
    public class CommandRegistration
    {
        public Action<CommandDTO> CallbackMethod { get; set; }
        public Type Type { get; set; }

        public CommandRegistration(Action<CommandDTO>  callbackMethod, Type type)
        {
            this.CallbackMethod = callbackMethod;
            this.Type = type;
        }
    }
}
