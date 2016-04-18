using Assets.Scripts.Communication.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication
{
    public interface ICommandInterceptor
    {
        bool InboundIntercept(CommandDTO commandDTO);

        bool OutboundIntercept(CommandDTO commandDTO);
    }
}
