using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Animation.DualStateAnimation
{
    [RequireComponent(typeof(Text))]
    class TextColorAnimator : DualStateAnimator
    {
        //Configurable script parameters
        public Color OriginalColor;
        public Color FlashColor;

        void Start()
        {
            base.stateAlternateAction = AlternateTextColor;
        }

        private void AlternateTextColor()
        {
            Text text = GetComponent<Text>();
            if (text.color.Equals(OriginalColor))
            {
                text.color = FlashColor;
            }
            else
            {
                text.color = OriginalColor;
            }
        }
    }
}
