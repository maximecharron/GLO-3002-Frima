using Assets.Scripts.Animation.SpriteAnimation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Scenes.Game
{
    class BackgroundController : MonoBehaviour
    {
        //Configurable script parameters
        public int SpritesheetColumnCount = 1;
        public int AspectRatio = 2;

        private SpriteAnimator spriteAnimator;
        private SpriteAnimationSequence backgroundSequence = new SpriteAnimationSequence(new List<int> { 0, 1, 2, 3 }, 2, -1);

        void Start()
        {
            spriteAnimator = new SpriteAnimator(GetComponent<Renderer>().material, SpritesheetColumnCount);
            spriteAnimator.Sequences.Add(backgroundSequence);
            AdjustPositioning();
        }

        private void AdjustPositioning()
        {
            Rect canvasRect = FindObjectOfType<Canvas>().GetComponent<RectTransform>().rect;
            this.transform.localScale = new Vector3(canvasRect.height * AspectRatio, canvasRect.height, 1);
        }

        void Update()
        {
            spriteAnimator.Animate();
        }

    }
}
