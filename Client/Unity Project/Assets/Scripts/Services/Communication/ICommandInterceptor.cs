using Assets.Scripts.Services.Communication.DTOs;

namespace Assets.Scripts.Services.Communication
{
    public interface ICommandInterceptor
    {
        bool InboundIntercept(CommandDTO commandDTO);

        bool OutboundIntercept(CommandDTO commandDTO);
    }
}
