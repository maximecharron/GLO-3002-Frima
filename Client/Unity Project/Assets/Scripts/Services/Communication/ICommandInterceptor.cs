using Assets.Scripts.Services.Communication.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.Communication
{
    public interface ICommandInterceptor
    {
        bool InboundIntercept(CommandDTO commandDTO);

        bool OutboundIntercept(CommandDTO commandDTO);
    }
}
