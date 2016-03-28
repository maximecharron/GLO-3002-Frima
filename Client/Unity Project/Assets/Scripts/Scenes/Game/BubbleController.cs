using UnityEngine;
using System.Collections;
using Assets.Scripts.Extensions;
using UnityEngine.UI;
using Assets.Scripts.Utils;

namespace Assets.Scripts.Scenes.Game
{
    public class BubbleController : MonoBehaviour
    {
        // Configurable script parameters
        public float Duration;

        public bool Active {
            get {
                return this.gameObject.activeSelf;
            }
        }

        private float startTime;

        void Update()
        {
            if (Time.time - startTime > Duration)
            {
                this.gameObject.SetActive(false);
            }
            else
            {
                float scale = AnimationUtils.ExponentialEaseOut(Time.time - startTime, Duration);
                this.transform.localScale = new Vector3(scale, scale, 1);
            }
        }

        public void Show(Vector2 position, string value)
        {
            this.transform.position = position.ToVector3(this.transform.position.z);
            startTime = Time.time;
            GetComponentInChildren<Text>().text = value.ToString();
            this.gameObject.SetActive(true);
        }
    }
}