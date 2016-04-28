using System;
using UnityEngine;

namespace Assets.Scripts.Animation.DualStateAnimation
{
    public class DualStateAnimator : MonoBehaviour
    {
        //Configurable script parameters
        public float Interval = 1f;
        public bool Enabled = true;

        private float lastActionTimeDelta;

        public Action stateAlternateAction;

        void Update()
        {
            lastActionTimeDelta += Time.deltaTime;
            if (Enabled && stateAlternateAction != null && lastActionTimeDelta >= Interval)
            {
                lastActionTimeDelta = 0;
                stateAlternateAction();
            }
        }
    }
}
