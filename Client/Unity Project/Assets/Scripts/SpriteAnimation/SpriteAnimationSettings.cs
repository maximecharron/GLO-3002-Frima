using Assets.Scripts.SpriteAnimation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.CharacterControl
{
    public class SpriteAnimationSettings
    {

        public bool RandomizeSequences { get; set; }
        public int NumberOfSequencesToPlay { get; set; }

        public SpriteAnimationSettings(bool randomizeSequences = false, int numberOfSequencesToPlay = -1)
        {
            this.RandomizeSequences = randomizeSequences;
            this.NumberOfSequencesToPlay = numberOfSequencesToPlay;
        }
    }
}
