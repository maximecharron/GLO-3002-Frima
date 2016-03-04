using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.CommandDTOs
{
    [Serializable]
    public abstract class CommandDTO
    {
        public String token { get; set; }
        public virtual object GetParameters()
        {
            throw new NotImplementedException("This command has no parameters defined.");
        }
    }
}
