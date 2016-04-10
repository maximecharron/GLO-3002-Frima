using UnityEngine;
using System.Collections;
using Assets.Scripts.Extensions;
using UnityEngine.UI;
using Assets.Scripts.Utils;
using System.Collections.Generic;

namespace Assets.Scripts.Scenes.Game
{
    public class BubbleController : MonoBehaviour
    {
        private static Vector3 initialMoveDirection = new Vector3(0, 50, 0);
        private static int Count = 0;

        // Configurable script parameters
        public float Duration;
        private Vector3 initialLocalPosition;
        private Vector3 targetLocalPosition;

        public bool Active {
            get {
                return this.gameObject.activeSelf;
            }
        }

        private float startTime;

        void Update()
        {
            if ( Time.time - startTime > Duration)
            {
                this.gameObject.SetActive(false);
            }
            else
            {
                AnimateScaling();
                AnimatePosition();
            }
        }

        private void AnimateScaling()
        {
            float scale = AnimationUtils.ExponentialEaseOut(Time.time - startTime, Duration);
            this.transform.localScale = new Vector3(scale, scale, 1);
        }

        private void AnimatePosition()
        {
            float yPosition = initialLocalPosition.y + (targetLocalPosition.y - initialLocalPosition.y) * AnimationUtils.ExponentialEaseOut(Time.time - startTime, Duration);
            this.transform.localPosition = new Vector3(targetLocalPosition.x, yPosition, targetLocalPosition.z);
        }

        public void Show(Vector2 position, string value, Color textColor)
        {
            this.transform.position = position.ToVector3(this.transform.position.z);
            initialLocalPosition = this.transform.localPosition;
            targetLocalPosition = new Vector3(MathUtils.ParityGet(Count, Random.Range(-180, -100), Random.Range(100, 180)), 185, initialLocalPosition.z);
            startTime = Time.time;
            Text text = GetComponentInChildren<Text>();
            text.text = value;
            text.color = textColor;
            Count += 1;
            this.gameObject.SetActive(true);
        }
    }
}