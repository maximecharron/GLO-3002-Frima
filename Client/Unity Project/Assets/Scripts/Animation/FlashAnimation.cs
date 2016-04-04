using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Animation
{
    class FlashAnimation : MonoBehaviour
    {
        public float FlashInterval = 1f;

        private DateTime lastFlashTime;

        void Update()
        {
            if ((DateTime.Now - lastFlashTime).TotalSeconds > FlashInterval)
            {
                lastFlashTime = DateTime.Now;
                if (this.GetComponent<CanvasGroup>().alpha == 0)
                {
                    this.GetComponent<CanvasGroup>().alpha = 1;
                } else
                {
                    this.GetComponent<CanvasGroup>().alpha = 0;
                }
            }
        }

    }
}
