using Assets.Scripts.Extensions;
using System;
using System.Collections.Generic;
using UnityEngine;

namespace Assets.Scripts
{
    public class MonoSingleton : MonoBehaviour
    {
        private static Dictionary<Type, MonoSingleton> instances = new Dictionary<Type, MonoSingleton>();

        void Awake()
        {
            if (instances.GetValueOrDefault(GetType(), null) == null)
            {
                instances.AddOrReplace(GetType(), this);
            }
            else
            {
                Destroy(this.gameObject);
            }
            DontDestroyOnLoad(this.gameObject);
        }

    }
}
