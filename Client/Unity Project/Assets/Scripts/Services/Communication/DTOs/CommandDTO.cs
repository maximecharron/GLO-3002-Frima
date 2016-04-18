using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.Communication.DTOs
{
    [Serializable]
    public abstract class CommandDTO
    {
        public string token;
    }
}
