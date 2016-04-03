using UnityEngine;
using System.Collections;
using Assets.Scripts.Extensions;
using UnityEngine.UI;
using Assets.Scripts.Utils;
using System;

namespace Assets.Scripts.Scenes.Game
{
    public class HitBubbleController : BubbleController
    {
        public void Show(Vector2 position, String text)
        {
            string bubbleText = text;
            base.Show(position, bubbleText);
        }
    }
}