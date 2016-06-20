using UnityEngine;

namespace Assets.Scripts.Extensions
{
    public static class CameraExtensions
    {
        public static Vector2 GetMousePosition(this Camera camera)
        {
            return Camera.main.ScreenToWorldPoint(Input.mousePosition);
        }
    }
}