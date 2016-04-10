using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Utils
{
    public static class MathUtils
    {
        public static T ParityGet<T>(int value, T oddValue, T evenValue)
        {
            if (value % 2 == 0)
            {
                return evenValue;
            }
            else
            {
                return oddValue;
            }
        }
    }
}
