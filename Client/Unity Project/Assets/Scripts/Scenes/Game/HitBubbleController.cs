using UnityEngine;
using System.Collections;
using Assets.Scripts.Extensions;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game
{
    public class HitBubbleController : MonoBehaviour
    {
        // Configurable script parameters
        public float Duration;

        public bool Active {
            get {
                return active;
            }
        }

        private float startTime;
        private bool active;

        void Start()
        {
            active = false;
        }

        void Update()
        {
            if (Time.time - startTime > Duration)
            {
                active = false;
                this.gameObject.SetActive(false);
            }
            else
            {
                active = true;
                float scale = Mathf.Pow((Time.time - startTime), 1f / 5f) / Mathf.Pow(Duration, 1f / 5f);
                this.transform.localScale = new Vector3(scale, scale, 1);
            }
        }

        public void Show(Vector2 position, int value)
        {
            this.transform.position = position.ToVector3(this.transform.position.z);
            startTime = Time.time;
            GetComponentInChildren<Text>().text = value.ToString() + "!";
            this.gameObject.SetActive(true);
        }
    }
}