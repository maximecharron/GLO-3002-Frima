using UnityEngine;

namespace Assets.Scripts.Extensions
{
    static class GameObjectExtensions
    {
        public static GameObject Clone(this GameObject gameObject)
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

        public static AudioSource FindAudioSource(this GameObject gameObject, AudioClip audioClip)
        {
            foreach (AudioSource audioSource in gameObject.GetComponents<AudioSource>())
            {
                if (audioSource.clip == audioClip)
                {
                    return audioSource;
                }
            }
            return null;
        }

        public static bool IsMouseDownOutside(this GameObject gameObject)
        {
            return Input.GetMouseButton(0) && !RectTransformUtility.RectangleContainsScreenPoint(gameObject.GetComponent<RectTransform>(), Input.mousePosition, Camera.main);
        }

        public static Vector3 Translate(this GameObject gameObject, Vector3 point, GameObject targetGameObject)
        {
            Vector2 worldPoint = gameObject.transform.TransformPoint(point);
            return targetGameObject.transform.InverseTransformPoint(worldPoint);
        }
    }
}
