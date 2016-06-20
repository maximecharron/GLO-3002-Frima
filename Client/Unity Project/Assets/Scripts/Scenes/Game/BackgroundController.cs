using Assets.Scripts.Animation.SpriteAnimation;
using Assets.Scripts.Extensions;
using Assets.Scripts.Services;
using System;
using System.Collections.Generic;
using UnityEngine;

namespace Assets.Scripts.Scenes.Game
{
    [RequireComponent(typeof(Renderer))]
    class BackgroundController : MonoBehaviour
    {
        //Configurable script parameters
        public int SpritesheetColumnCount = 4;
        public Canvas GameCanvas;

        private SpriteAnimator spriteAnimator;
        private List<SpriteAnimationSequence> animationSequences = new List<SpriteAnimationSequence>() {
            new SpriteAnimationSequence(new List<int> { 0, 1, 2, 3 }, 2, -1),
            new SpriteAnimationSequence(new List<int> { 4, 5, 6, 7 }, 2, -1),
            new SpriteAnimationSequence(new List<int> { 8, 9, 10, 11 }, 2, -1),
            new SpriteAnimationSequence(new List<int> { 12, 13, 14, 15 }, 2, -1)
        };

        private PlayerPropertyService playerPropertyService;

        void Start()
        {
            playerPropertyService = FindObjectOfType<PlayerPropertyService>();
            playerPropertyService.OnLevelUpCompleted += LevelUpCompletedEventHandler;
            spriteAnimator = new SpriteAnimator(GetComponent<Renderer>().material, SpritesheetColumnCount);
            SetAnimationSequence();
            AdjustPositioning();
        }

        void Update()
        {
            spriteAnimator.Animate();
        }

        void OnDestroy()
        {
            playerPropertyService.OnLevelUpCompleted -= LevelUpCompletedEventHandler;
        }

        private void LevelUpCompletedEventHandler()
        {
            SetAnimationSequence();
        }

        private void SetAnimationSequence()
        {
            SpriteAnimationSequence animationSequence = animationSequences[Math.Min(playerPropertyService.Level, 3)];
            spriteAnimator.Sequences.Clear();
            spriteAnimator.Sequences.Add(animationSequence);
            spriteAnimator.Reset();
        }

        private void AdjustPositioning()
        {
            Rect canvasRect = GameCanvas.GetComponent<RectTransform>().GetWorldRect();
            this.transform.localScale = new Vector3(canvasRect.width, this.transform.localScale.y, 1);
        }
    }
}
