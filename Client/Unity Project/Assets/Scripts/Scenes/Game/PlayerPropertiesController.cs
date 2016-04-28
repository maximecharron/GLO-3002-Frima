using Assets.Scripts.Scenes.Game.ComboHits;
using Assets.Scripts.Services;
using Assets.Scripts.Services.ComboHits;
using System;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game
{

    class PlayerPropertiesController : MonoBehaviour
    {
        //Configurable script parameters
        public ComboHitController ComboHitController;
        public Text levelLabel;
        public Text experienceLabel;
        
        private PlayerPropertyService playerPropertyService;

        void Start()
        {
            playerPropertyService = FindObjectOfType<PlayerPropertyService>();
            playerPropertyService.OnPlayerPropertiesUpdate += PlayerPropertiesUpdateEventHandler;
            ComboHitController.OnComboHitSequenceCompleted += ComboHitSequenceCompletedEventHandler;
            UpdateExperiencePointsLabel();
            UpdateLevelLabel();
        }

        void OnDestroy()
        {
            playerPropertyService.OnPlayerPropertiesUpdate -= PlayerPropertiesUpdateEventHandler;
        }

        private void PlayerPropertiesUpdateEventHandler()
        {
            UpdateExperiencePointsLabel();
            UpdateLevelLabel();
        }

        private void UpdateLevelLabel()
        {
            levelLabel.text = String.Format("Level {0}",  playerPropertyService.Level);
        }

        private void UpdateExperiencePointsLabel()
        {
            experienceLabel.text = String.Format("{0}/{1}", playerPropertyService.ExperiencePoints, playerPropertyService.RequiredExperiencePointsForNextLevel);
        }

        private void ComboHitSequenceCompletedEventHandler(ComboHitSequence comboHitSequence)
        {
            playerPropertyService.IncreaseExperiencePoints(comboHitSequence.BonusMultiplier);
        }
    }
}
