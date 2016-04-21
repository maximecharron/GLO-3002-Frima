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
        //Configurable script parameters
        public float FlashInterval = 1f;

        private float lastFlashTimeDelta;

        void Update()
        {
            lastFlashTimeDelta += Time.deltaTime;
            if (lastFlashTimeDelta >= FlashInterval)
            {
                lastFlashTimeDelta = 0;
                CanvasGroup canvasGroup = GetComponent<CanvasGroup>();
                if (canvasGroup.alpha == 0)
                {
                    canvasGroup.alpha = 1;
                } else
                {
                    canvasGroup.alpha = 0;
                }
            }
        }
    }
}
