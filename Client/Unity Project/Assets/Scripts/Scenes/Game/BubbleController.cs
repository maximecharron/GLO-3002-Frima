﻿using UnityEngine;
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

        private Vector3 targetPosition;
        private Vector3 initialPosition;


        public bool Active {
            get {
                return this.gameObject.activeSelf;
            }
        }

        private float startTime = float.MinValue;

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
            RectTransform transform = this.GetComponent<RectTransform>();
            float animationCurveValue = AnimationUtils.ExponentialEaseOut(Time.time - startTime, Duration);
            transform.position = initialPosition + (targetPosition - initialPosition) * animationCurveValue;
        }

        public void Show(Vector2 position, string value, Color? textColor = null, Vector2? targetPosition = null)
        {
            InitPositioning(position, targetPosition);
            InitText(value, textColor);
            startTime = Time.time;
            Count += 1;
            this.gameObject.SetActive(true);
        }

        private void InitPositioning(Vector2 position, Vector2? targetPosition)
        {
            this.transform.position = position.ToVector3(this.transform.position.z);
            initialPosition = this.transform.position;
            if (targetPosition == null)
            {
                RectTransform transform = this.GetComponent<RectTransform>();
                Canvas canvas = FindObjectOfType<Canvas>();
                this.targetPosition = canvas.transform.TransformPoint(new Vector3(Random.Range(-180, 180), 185, transform.localPosition.z));
            }
            else
            {
                this.targetPosition = targetPosition.Value.ToVector3(transform.position.z);
            }
        }

        private void InitText(string value, Color? textColor = null)
        {
            Text text = GetComponentInChildren<Text>(true);
            text.text = value;
            if (textColor != null) {
                text.color = textColor.Value;
            } else
            {
                text.color = Color.black;
            }
        }
    }
}