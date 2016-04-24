using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Extensions
{
    public static class IGroupingExtensions
    {
        public static T2 FirstElement<T1, T2>(this IGrouping<T1, T2> group)
        {
            return group.ElementAt(0);
        }
    }
}