using Assets.Scripts.Extensions;
using System;
using System.Collections.Generic;
using UnityEngine;

namespace Assets.Scripts.Utils.UnityObjectPool
{
    public class UnityObjectPool
    {
        public delegate void PoolItemInstantiateEventHandler(UnityEngine.Object obj);
        public event PoolItemInstantiateEventHandler OnPoolItemInstantiate = delegate { };

        private UnityEngine.Object referenceObject;
        private List<UnityEngine.Object> poolObjects = new List<UnityEngine.Object>();
        private Func<UnityEngine.Object, bool> itemAvailabilityPredicate;

        public UnityObjectPool(UnityEngine.Object referenceObject, int poolSize, Func<UnityEngine.Object, bool> itemAvailabilityPredicate)
        {
            this.referenceObject = referenceObject;
            this.itemAvailabilityPredicate = itemAvailabilityPredicate;

            for (int i = 0; i < poolSize; i++)
            {
                this.poolObjects.Add(InstantiatePoolObjects());
            }
        }

        public UnityObjectPool(GameObject gameObject, Type objectType, int poolSize, Func<UnityEngine.Object, bool> itemAvailabilityPredicate)
        {
            for (int i = 0; i < poolSize; i++)
            {
                this.poolObjects.Add(gameObject.AddComponent(objectType));
            }
            this.itemAvailabilityPredicate = itemAvailabilityPredicate;
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
            return itemAvailabilityPredicate(unityObject);
        }

    }
}
