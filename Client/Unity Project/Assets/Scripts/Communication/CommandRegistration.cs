using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts
{
    public class CommandRegistration
    {
        public Action<CommandDTO> callbackMethod { get; set; }
        public Type type { get; set; }

        public CommandRegistration(Action<CommandDTO>  callbackMethod, Type type)
        {
            this.callbackMethod = callbackMethod;
            this.type = type;
        }
    }
}
