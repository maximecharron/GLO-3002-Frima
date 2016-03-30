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
        public Action<UnityEngine.Object> OnObjectPoolInstantiate { get; set; }
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
            UnityEngine.Object newPoolObject = referenceObject.Clone();
            if (OnObjectPoolInstantiate != null)
            {
                OnObjectPoolInstantiate(newPoolObject);
            }
            return newPoolObject;
        }

        public UnityEngine.Object GetNext()
        {
            foreach (UnityEngine.Object gameObject in poolObjects)
            {
                if (OnCheckIsAvailable(gameObject))
                {
                    return gameObject;
                }
            }

            throw new PoolExhaustedException();
        }

    }
}
