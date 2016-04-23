using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Animation.DualStateAnimation
{
    public class DualStateAnimator : MonoBehaviour
    {
        //Configurable script parameters
        public float FlashInterval = 1f;
        public bool Enabled = true;

        private float lastFlashTimeDelta;

        public Action stateAlternateAction;

        void Update()
        {
            lastFlashTimeDelta += Time.deltaTime;
            if (Enabled && stateAlternateAction != null && lastFlashTimeDelta >= FlashInterval)
            {
                lastFlashTimeDelta = 0;
                stateAlternateAction();
            }
        }
    }
}
