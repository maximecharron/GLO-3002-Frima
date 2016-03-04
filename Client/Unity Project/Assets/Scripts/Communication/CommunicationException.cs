using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication
{
    class CommunicationException : Exception
    {
        public CommunicationException()
        {
        }

        public CommunicationException(string message)
        : base(message)
    {
        }

        public CommunicationException(string message, Exception inner)
        : base(message, inner)
    {
        }
    }
}
