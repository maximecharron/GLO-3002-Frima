using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Extensions
{
    static class UnityObjectExtensions
    {
        public static UnityEngine.Object Clone(this UnityEngine.Object obj)
        {
            if (obj.GetType() == typeof(GameObject))
            {
                return ((GameObject)obj).Clone();
            }
            else
            {
                return UnityEngine.Object.Instantiate(obj);
            }
        }
    }
}
