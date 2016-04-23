using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Animation.DualStateAnimation
{
    [RequireComponent(typeof(Image))]
    class ImageColorAnimator : DualStateAnimator
    {
        //Configurable script parameters
        public Color OriginalColor;
        public Color FlashColor;

        void Start()
        {
            base.stateAlternateAction = AlternateImageColor;
        }

        private void AlternateImageColor()
        {
            Image image = GetComponent<Image>();
            if (image.color.Equals(OriginalColor))
            {
                image.color = FlashColor;
            }
            else
            {
                image.color = OriginalColor;
            }
        }
    }
}
