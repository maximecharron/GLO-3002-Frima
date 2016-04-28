using UnityEngine;

namespace Assets.Scripts.Extensions
{
    public static class Vector2Extensions
    {

        public static Vector3 ToVector3(this Vector2 vector2, float z)
        {
            Vector3 vector3 = vector2;
            vector3.z = z;
            return vector3;
        }

    }
}