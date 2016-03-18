using UnityEngine;
using System.Collections;
using System.Net;

namespace Assets.Scripts.Extensions
{
    public static class WWWExtensions
    {

        public static HttpStatusCode GetStatusCode(this WWW request)
        {
            if (request.responseHeaders == null || !request.responseHeaders.ContainsKey("STATUS"))
            {
                return 0;
            }
            return parseResponseCodeFromStatusLine(request.responseHeaders["STATUS"]);
        }

        private static HttpStatusCode parseResponseCodeFromStatusLine(string statusLine)
        {
            int code = 0;
            string[] components = statusLine.Split(' ');
            if (components.Length < 3 || !int.TryParse(components[1], out code))
            {
                return 0;
            }
            return (HttpStatusCode)code;
        }
    }
}