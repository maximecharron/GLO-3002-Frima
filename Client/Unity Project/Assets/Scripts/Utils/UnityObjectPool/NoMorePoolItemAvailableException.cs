using UnityEngine;
using System.Collections;
using System;

namespace Assets.Scripts.Utils.UnityObjectPool
{
    public class NoMorePoolItemAvailableException : Exception
    {

        public NoMorePoolItemAvailableException() : base() { }
    }
}