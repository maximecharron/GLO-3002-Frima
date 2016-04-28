namespace Assets.Scripts.Animation.SpriteAnimation
{
    public class SpriteAnimationSettings
    {

        public bool RandomizeSequences { get; set; }

        public SpriteAnimationSettings(bool randomizeSequences = false)
        {
            this.RandomizeSequences = randomizeSequences;
        }
    }
}
