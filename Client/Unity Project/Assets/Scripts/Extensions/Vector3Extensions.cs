using UnityEngine;

namespace Assets.Scripts.Extensions
{
    public static class Vector3Extensions
    {

        public static Vector3 Clone(this Vector3 vector3)
        {
            return new Vector3(vector3.x, vector3.y, vector3.z);
        }

    }
}