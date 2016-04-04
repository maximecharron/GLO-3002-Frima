using Assets.Scripts.Animation.SpriteAnimation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.CharacterControl
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
