using Assets.Scripts.Communication.CommandDTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication
{
    public interface ICommandInterceptor
    {
        bool ReceiveIntercept(CommandDTO commandDTO);

        bool SendIntercept(CommandDTO commandDTO);
    }
}
