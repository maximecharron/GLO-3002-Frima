using System.Collections.Generic;

namespace Assets.Scripts.Animation.SpriteAnimation
{
    public class SpriteAnimationSequence
    {
        private const int REPEAT_INFINITE = -1;

        public List<int> Frames { get; set; }
        public int FramesPerSecond { get; set; }
        public int RepeatCount { get; set; }

        public bool EndOfSequence
        {
            get
            {
                if (RepeatCount == REPEAT_INFINITE)
                {
                    return false;
                }
                else
                {
                    return totalFrame + 1 >= RepeatCount * Frames.Count;
                }
            }
        }

        private int currentFrame;
        private int totalFrame;

        public SpriteAnimationSequence(List<int> frames, int framesPerSecond, int repeat_count = REPEAT_INFINITE)
        {
            this.Frames = frames;
            this.FramesPerSecond = framesPerSecond;
            this.RepeatCount = repeat_count;
            Init();
        }

        private void Init()
        {
            currentFrame = -1;
            totalFrame = -1;
        }

        public int NextFrame()
        {
            if (!EndOfSequence)
            {
                currentFrame++;
                if (currentFrame >= Frames.Count)
                {
                    currentFrame = 0;
                }
                totalFrame++;
            }
            return Frames[currentFrame];
        }

        public void Reset()
        {
            Init();
        }
    }
}