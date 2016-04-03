using UnityEngine;
using System.Collections;
using Assets.Scripts.Extensions;
using UnityEngine.UI;
using Assets.Scripts.Utils;

namespace Assets.Scripts.Scenes.Game
{
    public class HitBubbleController : BubbleController
    {
        public void Show(Vector2 position, int hitValue)
        {
            string bubbleText = string.Format("{0}!", hitValue);
            base.Show(position, bubbleText);
        }
    }
}