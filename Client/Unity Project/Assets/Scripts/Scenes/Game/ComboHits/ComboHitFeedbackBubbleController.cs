using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Scenes.Game.ComboHits
{
    class ComboHitFeedbackBubbleController : BubbleController
    {
        private static Color HIT_FEEDBACK_TEXT_COLOR = new Color(54f / 255f, 97f / 255f, 1f);

        public void Show(Vector2 position, int value)
        {
            base.Show(position, value.ToString(), HIT_FEEDBACK_TEXT_COLOR, false);
        }
    }
}
