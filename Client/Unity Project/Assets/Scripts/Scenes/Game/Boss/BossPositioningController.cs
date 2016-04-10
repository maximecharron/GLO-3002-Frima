using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Scenes.Game.Boss
{
    class BossPositioningController : MonoBehaviour
    {
        public const float BOSS_RELATIVE_HEIGHT = 1f;
        public const float BOSS_POSITION_FROM_BOTTOM = 50;

        void Start()
        {
            Rect canvasRect = FindObjectOfType<Canvas>().GetComponent<RectTransform>().rect;
            float verticalScale = canvasRect.height * BOSS_RELATIVE_HEIGHT;
            this.transform.localScale = new Vector3(verticalScale, verticalScale, 1);
            this.transform.localPosition = new Vector3(this.transform.localPosition.x, BOSS_POSITION_FROM_BOTTOM - (canvasRect.height - verticalScale) / 2, this.transform.localPosition.z);
        }
    }
}
