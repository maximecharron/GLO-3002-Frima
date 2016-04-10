using Assets.Scripts.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Utils.UnityObjectPool
{
    public class UnityObjectPool
    {
        public Action<UnityEngine.Object> OnPoolItemInstantiate { get; set; }
        public Func<UnityEngine.Object, bool> OnCheckIsAvailable { get; set; }

        private UnityEngine.Object referenceObject;
        private List<UnityEngine.Object> poolObjects = new List<UnityEngine.Object>();
        private int poolSize;

        public UnityObjectPool(UnityEngine.Object referenceObject, int poolSize)
        {
            this.referenceObject = referenceObject;
            this.poolSize = poolSize;

            for (int i = 0; i < poolSize; i++)
            {
                this.poolObjects.Add(InstantiatePoolObjects());
            }
        }

        public UnityObjectPool(List<UnityEngine.Object> poolObjects)
        {
            this.poolObjects = poolObjects;
        }

        public UnityObjectPool(GameObject gameObject, Type objectType, int poolSize)
        {
            for (int i = 0; i < poolSize; i++)
            {
                this.poolObjects.Add(gameObject.AddComponent(objectType));
            }
        }

        private UnityEngine.Object InstantiatePoolObjects()
        {
            UnityEngine.Object newObject = referenceObject.Clone();
            if (OnPoolItemInstantiate != null)
            {
                OnPoolItemInstantiate(newObject);
            }
            return newObject;
        }

        public UnityEngine.Object GetNext()
        {
            foreach (UnityEngine.Object unityObject in poolObjects)
            {
                if (IsItemAvailable(unityObject))
                {
                    return unityObject;
                }
            }

            throw new PoolExhaustedException();
        }

        private bool IsItemAvailable(UnityEngine.Object unityObject)
        {
            if (OnCheckIsAvailable == null && unityObject.GetType() == typeof(GameObject))
            {
                return !((GameObject)unityObject).activeSelf;
            }
            else
            {
                return OnCheckIsAvailable(unityObject);
            }
        }

    }
}
