using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Animation
{
    [RequireComponent(typeof(CanvasGroup))]
    class FlashAnimation : MonoBehaviour
    {
        public float FlashInterval = 1f;

        private float lastFlashTimeDelta;

        void Update()
        {
            lastFlashTimeDelta += Time.deltaTime;
            if (lastFlashTimeDelta >= FlashInterval)
            {
                lastFlashTimeDelta = 0;
                if (GetComponent<CanvasGroup>().alpha == 0)
                {
                    GetComponent<CanvasGroup>().alpha = 1;
                } else
                {
                    GetComponent<CanvasGroup>().alpha = 0;
                }
            }
        }
    }
}
