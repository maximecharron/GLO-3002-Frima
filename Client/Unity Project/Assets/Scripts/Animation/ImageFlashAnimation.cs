using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Animation
{
    [RequireComponent(typeof(Image))]
    class ImageFlashAnimation : MonoBehaviour
    {
        //Configurable script parameters
        public float FlashInterval = 1f;
        public Color OriginalColor;
        public Color FlashColor;
        public bool Enabled = true;

        private float lastFlashTimeDelta;

        void Update()
        {
            lastFlashTimeDelta += Time.deltaTime;
            if (lastFlashTimeDelta >= FlashInterval)
            {
                lastFlashTimeDelta = 0;
                Image image = GetComponent<Image>();
                if (Enabled && image.color.Equals(OriginalColor))
                {
                    image.color = FlashColor;
                } else
                {
                    image.color = OriginalColor;
                }
            }
        }
    }
}
