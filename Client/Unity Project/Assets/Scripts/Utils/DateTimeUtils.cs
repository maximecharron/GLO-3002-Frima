using System;

namespace Assets.Scripts.Utils
{
    class DateTimeUtils
    {
        public static DateTime ConvertFromJavaScriptDate(long javaScriptDate)
        {
            return new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc).AddMilliseconds(javaScriptDate).ToLocalTime();
        }
    }
}
