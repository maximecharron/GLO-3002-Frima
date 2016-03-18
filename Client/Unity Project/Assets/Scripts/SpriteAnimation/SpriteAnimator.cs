using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using System;
using Assets.Scripts.CharacterControl;

namespace Assets.Scripts.SpriteAnimation
{
    public class SpriteAnimator
    {
        public List<SpriteAnimationSequence> Sequences { get; set; }
        public SpriteAnimationSequence TransitionSequence { get; set; }
        public SpriteAnimationSettings Settings { get; set; }
        public Func<bool> OnAnimationSequenceEnd { get; set; }

        private Material material;
        private int spriteSheetColumnCount;
        private int currentSequenceIndex = -1;
        private SpriteAnimationSequence currentSequence;
        private float lastAnimateTime = 0;
        private UnityEngine.Random random = new UnityEngine.Random();

        public SpriteAnimator(Material material, int columnCount)
        {
            this.material = material;
            this.spriteSheetColumnCount = columnCount;
            this.Sequences = new List<SpriteAnimationSequence>();
        }

        public void Reset()
        {
            currentSequenceIndex = -1;
            currentSequence = null;
            lastAnimateTime = 0;
        }

        public void Animate()
        {
            if (currentSequence != null && (Time.time - lastAnimateTime) < (1.0f / currentSequence.FramesPerSecond))
            {
                return;
            }
            lastAnimateTime = Time.time;
            if (currentSequence == null || currentSequence.EndOfSequence()) {
                currentSequence = GetNextSequence();
            }
            this.SetFrame(currentSequence.NextFrame());
        }

        private SpriteAnimationSequence GetNextSequence()
        {
            if (currentSequence == null && TransitionSequence != null)
            {
                return TransitionSequence;
            }
            else
            {
                if (currentSequenceIndex != -1 && OnAnimationSequenceEnd != null)
                {
                    if (!OnAnimationSequenceEnd())
                    {
                        return currentSequence;
                    }
                }
                return GetNextMainSequence();
            }
        }

        private SpriteAnimationSequence GetNextMainSequence()
        {
            if (Settings.RandomizeSequences)
            {
                currentSequenceIndex = UnityEngine.Random.Range(0, Sequences.Count);
            }
            else {
                currentSequenceIndex++;
                if (currentSequenceIndex >= Sequences.Count)
                {
                    currentSequenceIndex = 0;
                }
            }
            Sequences[currentSequenceIndex].Reset();
            return Sequences[currentSequenceIndex];
        }

        public void SetFrame(int index)
        {
            int row = index / this.spriteSheetColumnCount;
            int column = index % this.spriteSheetColumnCount;

            SetFrame(row, column);
        }

        public void SetFrame(int row, int column)
        {
            Vector2 textureScale = material.GetTextureScale("_MainTex");
            float offsetX = column * textureScale.x;
            float offsetY = 1.0f - ((row + 1) * textureScale.y);

            material.mainTextureOffset = new Vector2(offsetX, offsetY);
        }
    }
}