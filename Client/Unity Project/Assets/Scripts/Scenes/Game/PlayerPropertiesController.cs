using Assets.Scripts.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game
{

    class PlayerPropertiesController : MonoBehaviour
    {
        //Configurable script parameters
        public Text levelLabel;
        public Text experienceLabel;
        
        private PlayerPropertyService playerPropertyService;

        void Start()
        {
            playerPropertyService = FindObjectOfType<PlayerPropertyService>();
            playerPropertyService.OnPlayerPropertiesUpdate += PlayerPropertiesUpdateEventHandler;
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
    }
}
