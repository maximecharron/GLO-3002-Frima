using UnityEngine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Assets.Scripts.SpriteAnimation;
using Assets.Scripts.Extensions;

namespace Assets.Scripts.CharacterControl
{
    public class CharacterAnimationController
    {
        private SpriteAnimator spriteAnimator;
        private CharacterState currentStateAnimation;
        private CharacterState lastStateAnimation;

        public CharacterAnimationController(SpriteAnimator spriteAnimator)
        {
            this.spriteAnimator = spriteAnimator;
        }

        public void Animate(List<CharacterState> states)
        {
            if (states.Count == 0)
            {
                return;
            }
            CharacterState state = states.FindMin(playerState => playerState.AnimationPriority);
            ChangeAnimation(state);
            AnimateState(state);
        }

        private void ChangeAnimation(CharacterState newState)
        {
            if (currentStateAnimation != newState)
            {
                lastStateAnimation = currentStateAnimation;
                currentStateAnimation = newState;
                spriteAnimator.Reset();
            }
        }

        private void AnimateState(CharacterState state)
        {
            try {
                spriteAnimator.Sequences = state.GetSpriteAnimationSequences();
            }
            catch (SpriteAnimationNotAvailableException)
            {
                return;
            }

            try
            {
                spriteAnimator.TransitionSequence = state.GetTransitionAnimationSequence(lastStateAnimation);
            }
            catch (SpriteAnimationNotAvailableException)
            {
                spriteAnimator.TransitionSequence = null;
            }

            spriteAnimator.Settings = state.SpriteAnimationSettings;
            spriteAnimator.OnAnimationSequenceEnd = OnAnimationSequenceEnd;
            spriteAnimator.Animate();
        }

        private bool OnAnimationSequenceEnd()
        {
            if (currentStateAnimation.OnAnimationSequenceEnd != null)
            {
                return currentStateAnimation.OnAnimationSequenceEnd(currentStateAnimation);
            }
            return true;
        }
    }
}
