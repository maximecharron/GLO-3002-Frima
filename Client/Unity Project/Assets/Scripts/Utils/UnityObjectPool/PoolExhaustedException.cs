using UnityEngine;
using System.Collections;
using System;

namespace Assets.Scripts.Utils.UnityObjectPool
{
    public class PoolExhaustedException : Exception
    {
        public PoolExhaustedException() : base() { }
    }
}