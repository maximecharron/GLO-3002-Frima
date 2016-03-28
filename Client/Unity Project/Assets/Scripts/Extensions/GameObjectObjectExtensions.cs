using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Extensions
{
    static class GameObjectObjectExtensions
    {
        public static UnityEngine.Object Clone(this GameObject gameObject)
        {
            GameObject gameObjectClone = (GameObject)UnityEngine.Object.Instantiate(gameObject, gameObject.transform.position.Clone(), Quaternion.identity);
            gameObjectClone.transform.parent = gameObject.transform.parent;
            gameObjectClone.transform.localPosition = gameObject.transform.localPosition.Clone();
            gameObjectClone.transform.localScale = gameObject.transform.localScale.Clone();
            return gameObjectClone;
        }

        public static Vector2 GetMousePosition(this GameObject gameObject)
        {
            Vector2 worldPosition = Camera.main.GetMousePosition();
            return gameObject.transform.InverseTransformPoint(worldPosition);
        }
    }
}
