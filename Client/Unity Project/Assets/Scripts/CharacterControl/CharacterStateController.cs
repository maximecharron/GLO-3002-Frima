using Assets.Scripts.Extensions;
using System.Collections.Generic;
using System.Linq;

namespace Assets.Scripts.CharacterControl
{
    public class CharacterStateController
    {
        private CharacterAnimationController animationController;
        private List<CharacterState> states = new List<CharacterState>();
        private Queue<CharacterState> stateHistory = new Queue<CharacterState>();

        public CharacterStateController(CharacterAnimationController animationController)
        {
            this.animationController = animationController;
        }

        public void AddState(CharacterState state, bool overwrite = false) {
            if (states.Contains(state) && overwrite)
            {
                RemoveState(state);
            }
            if (!states.Contains(state))
            {
                states.Add(state);
                AddStateToHistory(state); 
            }
        }

        public void SetState(CharacterState state)
        {
            AddState(state);
            RemoveAllStates(state);
        }

        public bool HasState(CharacterState state)
        {
            return states.Contains(state);
        }

        public bool HasActiveState(CharacterState state)
        {
            return HasState(state) && state.IsActive;
        }

        public void RemoveState(CharacterState state)
        {
            if (states.Contains(state))
            {
                state.Deactivate();
                states.Remove(state);
            }
        }

        public void RemoveAllStates(params CharacterState[] statesToKeep)
        {
            for (int i = states.Count - 1; i >= 0; i--)
            {
                if (!states[i].In(statesToKeep))
                {
                    RemoveState(states[i]);
                }
            }
        }

        public CharacterState GetStateHistoryItem(int number)
        {
            if (number > stateHistory.Count)
            {
                return null;
            }
            return stateHistory.ElementAt(stateHistory.Count - number);
        }

        public void Update()
        {
            UpdateStates();
            animationController.Animate(states);
        }

        private void AddStateToHistory(CharacterState state)
        {
            stateHistory.Enqueue(state);
            if (stateHistory.Count > 10)
            {
                stateHistory.Dequeue();
            }
        }

        private void UpdateStates()
        {
            for (int i = 0; i < states.Count; i++)
            {
                if (states[i].IsActivable(states)) {
                    states[i].Activate();
                    states[i].Update();
                }
                else
                {
                    states[i].Deactivate();
                }
            }
        }
    }
}
