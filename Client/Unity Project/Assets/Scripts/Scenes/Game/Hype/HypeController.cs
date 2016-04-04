using System;
using UnityEngine;
using System.Collections;
using Assets.Scripts.Scenes.Game.Combos;
using Assets.Scripts.Scenes.Game.Stamina;
using UnityEngine.UI;


namespace Assets.Scripts.Scenes.Game.Hype
{
    public class HypeController : MonoBehaviour
    {
        public ComboHitController ComboHitController;
        public HypeSliderController HypeSliderController;

        public Action OnHypeAttack { get; set; }
            
        private DateTime lastUpdateCall = DateTime.Now;
        private DateTime lastMaxHypeReach = DateTime.MinValue;
        private bool HypeReached = false;
        private const float HYPE_INCREASE_ON_HIT = 3f;
        private const float HYPE_DRAIN_ON_HIT = 5f;
        private const int HYPE_BONUS_MULTIPLIER = 2;
        private const float HYPE_DECREASE_VALUE = 0.5f;
        private const float HYPE_DECREASE_FREQUENCY_SECONDS = 0.05f;
        private const float HYPE_POWER_AVAILABLE_TIME_SECONDS = 1.5f;


        public void OnHypeButtonClick()
        {
            if (HypeReached)
            {
                OnHypeAttack();
            }
        }

        // Use this for initialization
        void Start()
        {
            HypeSliderController.Value = 0;
            ComboHitController.OnHitSequenceAchieved = OnHitSequenceAchievedCallback;
        }

        void OnHitSequenceAchievedCallback(ComboHitSequence hitSequence)
        {
           addHitHype(hitSequence.BonusMultiplier* HYPE_BONUS_MULTIPLIER);
        } 

        // Update is called once per frame
        void Update()
        {
            if (DateTime.Now.Subtract(lastUpdateCall).TotalSeconds > HYPE_DECREASE_FREQUENCY_SECONDS)
            {

                if (HypeSliderController.Value == 100 && !HypeReached)
                {
                    lastMaxHypeReach = DateTime.Now;
                    HypeReached = true;
                    HypeSliderController.FlashSlider = true;
                }
                else if(!HypeReached || (HypeReached && DateTime.Now.Subtract(lastMaxHypeReach).TotalSeconds > HYPE_POWER_AVAILABLE_TIME_SECONDS))
                {
                    HypeSliderController.Value = Math.Max(0, HypeSliderController.Value - HYPE_DECREASE_VALUE);
                    HypeReached = false;
                    HypeSliderController.FlashSlider = false;
                }
                lastUpdateCall = DateTime.Now;
                }
            }

        public void addHitHype(int multiplier = 1)
        {
            HypeSliderController.Value += Math.Min(HypeSliderController.MaxValue,
                HYPE_INCREASE_ON_HIT * multiplier);
        }
    }

}