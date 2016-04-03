using UnityEngine;
using System.Collections;
using Assets.Scripts.Extensions;
using UnityEngine.UI;
using Assets.Scripts.Utils;

namespace Assets.Scripts.Scenes.Game.Combos
{
    public class ComboBonusBubbleController : BubbleController
    {
        public void Show(Vector2 position, int bonusMultiplier, Color textColor)
        {
            Text text = GetComponentInChildren<Text>();
            text.color = textColor;
            string bubbleText = string.Format("BONUS\r\nX{0}!", bonusMultiplier);
            base.Show(position, bubbleText);
        }
    }
}