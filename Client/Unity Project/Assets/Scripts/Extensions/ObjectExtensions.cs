using System.Linq;

namespace Assets.Scripts.Extensions
{
    static class ObjectExtensions
    {
        public static bool In<T>(this T obj, params T[] args)
        {
            return args.Contains(obj);
        }
    }
}
