using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Extensions
{
    public static class TimeSpanExtensions
    {
        public static String FormatToSimpleSeconds(this TimeSpan timeSpan)
        {
            int minutes = (int)Math.Floor(Math.Abs(timeSpan.TotalSeconds) % 3600 / 60);
            int seconds = (int)Math.Floor(Math.Abs(timeSpan.TotalSeconds) % 3600 % 60);
            return String.Format("{0}:{1:D2}", minutes, seconds);
        }
    }
}
