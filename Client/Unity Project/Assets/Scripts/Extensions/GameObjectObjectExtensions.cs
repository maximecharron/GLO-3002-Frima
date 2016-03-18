using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Extensions
{
    static class GameObjectObjectExtensions
    {
        public static UnityEngine.Object Clone(this GameObject obj)
        {
            GameObject gameObject = (GameObject)UnityEngine.Object.Instantiate(obj, obj.transform.position.Clone(), Quaternion.identity);
            gameObject.transform.parent = obj.transform.parent;
            gameObject.transform.localPosition = obj.transform.localPosition.Clone();
            gameObject.transform.localScale = obj.transform.localScale.Clone();
            return gameObject;
        }
    }
}
