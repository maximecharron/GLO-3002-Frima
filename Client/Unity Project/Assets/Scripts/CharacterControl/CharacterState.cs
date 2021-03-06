﻿using Assets.Scripts.Animation.SpriteAnimation;
using System.Collections.Generic;

namespace Assets.Scripts.CharacterControl
{
    public class CharacterState
    {
        public string StateName { get; set; }
        public int Priority { get; set; }
        public int AnimationPriority { get; set; }
        public bool IsActive { get; set; }
        public delegate void ActivateEventHandler(CharacterState characterState);
        public event ActivateEventHandler OnActivate = delegate { };
        public delegate void DeactivateEventHandler(CharacterState characterState);
        public event DeactivateEventHandler OnDeactivate = delegate { };
        public delegate void UpdateEventHandler(CharacterState characterState);
        public event UpdateEventHandler OnUpdate = delegate { };
        public delegate bool AnimationSequenceCompleteEventHandler(CharacterState characterState);
        public event AnimationSequenceCompleteEventHandler OnAnimationSequenceComplete = delegate { return true; };
        public List<CharacterState> IncompatibleStates { get; set; }
        public List<SpriteAnimationSequence> SpriteAnimationSequences { get; set; }
        public Dictionary<CharacterState, SpriteAnimationSequence> SpriteTransitionAnimationSequences { get; set; }
        public SpriteAnimationSettings SpriteAnimationSettings { get; set; }

        public CharacterState(string stateName, int priority, int animationPriority, SpriteAnimationSettings spriteAnimationSettings)
        {
            this.StateName = stateName;
            this.Priority = priority;
            this.AnimationPriority = animationPriority;
            this.SpriteAnimationSettings = spriteAnimationSettings;

            this.IncompatibleStates = new List<CharacterState>();
            this.SpriteAnimationSequences = new List<SpriteAnimationSequence>();
            this.SpriteTransitionAnimationSequences = new Dictionary<CharacterState, SpriteAnimationSequence>();
            this.IsActive = false;
        }

        public void AddIncompatibleStates(params CharacterState[] states)
        {
            foreach (CharacterState state in states)
            {
                if (!IncompatibleStates.Contains(state))
                {
                    IncompatibleStates.Add(state);
                }
            }
        }

        public void AddSpriteAnimationSequence(SpriteAnimationSequence spriteAnimationSequence)
        {
            SpriteAnimationSequences.Add(spriteAnimationSequence);
        }

        public void AddTransitionAnimationSequence(CharacterState lastState, SpriteAnimationSequence spriteAnimationSequence)
        {
            SpriteTransitionAnimationSequences.Add(lastState, spriteAnimationSequence);
        }

        public List<SpriteAnimationSequence> GetSpriteAnimationSequences()
        {
            if (SpriteAnimationSequences != null)
            {
                return SpriteAnimationSequences;
            }
            else
            {
                throw new SpriteAnimationNotAvailableException();
            }
        }

        public SpriteAnimationSequence GetTransitionAnimationSequence(CharacterState lastStateAnimation)
        {
            if (lastStateAnimation == null || !SpriteTransitionAnimationSequences.ContainsKey(lastStateAnimation))
            {
                throw new SpriteAnimationNotAvailableException();
            }
            return SpriteTransitionAnimationSequences[lastStateAnimation];
        }

        public void Update()
        {
            OnUpdate(this);
        }

        public void Activate()
        {
            if (IsActive)
            {
                return;
            }
            IsActive = true;
            OnActivate(this);
        }

        public void Deactivate()
        {
            if (!IsActive)
            {
                return;
            }
            IsActive = false;
            OnDeactivate(this);
        }

        public bool IsActivable(List<CharacterState> states)
        {
            foreach (CharacterState state in states)
            {
                if (state == this) { continue; }
                if (IncompatibleStates.Contains(state) || state.IncompatibleStates.Contains(this))
                {
                    if (!HasPriority(state))
                    {
                        return false;
                    }
                }
            }
            return true;
        }

        public bool HasPriority(CharacterState state)
        {
            return Priority <= state.Priority;
        }

        public bool AnimationComplete()
        {
            return OnAnimationSequenceComplete(this);
        }
    }
}
