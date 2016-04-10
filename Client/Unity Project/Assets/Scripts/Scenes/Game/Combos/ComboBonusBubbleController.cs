using UnityEngine;
using System.Collections;
using Assets.Scripts.Extensions;
using UnityEngine.UI;
using Assets.Scripts.Utils;

namespace Assets.Scripts.Scenes.Game.Combos
{
    public class ComboBonusBubbleController : BubbleController
    {
        private static Color BONUS_BUBBLE_TEXT_COLOR = Color.black;

        public void Show(Vector2 position, int bonusMultiplier, Color textColor)
        {
            string bubbleText = string.Format("BONUS\r\nX{0}!", bonusMultiplier, textColor);
            base.Show(position, bubbleText);
        }
    }
}