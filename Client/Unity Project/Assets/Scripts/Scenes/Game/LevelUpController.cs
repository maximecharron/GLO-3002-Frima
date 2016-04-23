using Assets.Scripts.Extensions;
using Assets.Scripts.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Game
{
    [RequireComponent(typeof(CanvasGroup))]
    class LevelUpController : MonoBehaviour
    {
        //Configurable script parameters
        public GameSceneController GameSceneController;
        public Text CurrentExperienceText;
        public Text UpgradeExplanationText;
        public Text StaminaPowerLevelText;
        public Text HypePowerLevelText;
        public Text AttackPowerLevelText;
        public Button RevertButton;
        public Button ContinueButton;

        private PlayerPropertyService playerPropertyService;
        private int staminaPowerLevelUpgrade = 0;
        private int hypePowerLevelUpgrade = 0;
        private int attackPowerLevelUpgrade = 0;

        void Start()
        {
            playerPropertyService = FindObjectOfType<PlayerPropertyService>();
            playerPropertyService.OnLevelUp += LevelUpCallback;
            playerPropertyService.OnLevelUpCompleted += LevelUpCompletedEventHandler;
            Hide();
        }

        void OnDestroy()
        {
            playerPropertyService.OnLevelUp -= LevelUpCallback;
            playerPropertyService.OnLevelUpCompleted -= LevelUpCompletedEventHandler;
        }

        private void ShowPanel()
        {
            GameSceneController.PauseGame();
            this.gameObject.SetActive(true);
        }

        private void Hide()
        {
            GameSceneController.ResumeGame();
            this.gameObject.SetActive(false);
        }

        void LevelUpCallback()
        {
            InitState();
            ShowPanel();
        }

        private void InitState()
        {
            staminaPowerLevelUpgrade = 0;
            hypePowerLevelUpgrade = 0;
            attackPowerLevelUpgrade = 0;
            UpdateLabels();
            UpdateButtonsState();
        }

        private void UpdateButtonsState()
        {
            RevertButton.interactable = GetUsedUpgradePoints() > 0;
            ContinueButton.interactable = GetUsedUpgradePoints() == playerPropertyService.UpgradePointsOnLevelComplete;
        }

        private void UpdateLabels()
        {
            CurrentExperienceText.text = String.Format("Your current experience: {0}", playerPropertyService.ExperiencePoints);
            UpgradeExplanationText.text = String.Format("Upgrade your powers ({0} points left):", playerPropertyService.UpgradePointsOnLevelComplete - GetUsedUpgradePoints());
            StaminaPowerLevelText.text = String.Format("{0} (+{1})", playerPropertyService.StaminaPowerLevel, staminaPowerLevelUpgrade);
            HypePowerLevelText.text = String.Format("{0} (+{1})", playerPropertyService.HypePowerLevel, hypePowerLevelUpgrade);
            AttackPowerLevelText.text = String.Format("{0} (+{1})", playerPropertyService.AttackPowerLevel, attackPowerLevelUpgrade);
        }

        private int GetUsedUpgradePoints()
        {
            return staminaPowerLevelUpgrade + hypePowerLevelUpgrade + attackPowerLevelUpgrade;
        }

        public void OnStaminaUpgradeClick()
        {
            if (GetUsedUpgradePoints() < playerPropertyService.UpgradePointsOnLevelComplete)
            {
                staminaPowerLevelUpgrade = staminaPowerLevelUpgrade + 1;
                ProcessUpgrade();
            }
        }

        public void OnHypeUpgradeClick()
        {
            if (GetUsedUpgradePoints() < playerPropertyService.UpgradePointsOnLevelComplete)
            {
                hypePowerLevelUpgrade = hypePowerLevelUpgrade + 1;
                ProcessUpgrade();
            }
        }

        public void OnAttackUpgradeClick()
        {
            if (GetUsedUpgradePoints() < playerPropertyService.UpgradePointsOnLevelComplete)
            {
                attackPowerLevelUpgrade = attackPowerLevelUpgrade + 1;
                ProcessUpgrade();
            }
        }

        private void ProcessUpgrade()
        {
            UpdateLabels();
            UpdateButtonsState();
        }

        public void OnRevertButtonClick()
        {
            InitState();
        }

        public void OnContinueButtonClick()
        {
            playerPropertyService.Upgrade(staminaPowerLevelUpgrade, hypePowerLevelUpgrade, attackPowerLevelUpgrade);
            GetComponent<CanvasGroup>().interactable = false;
        }

        public void LevelUpCompletedEventHandler()
        {
            GetComponent<CanvasGroup>().interactable = true;
            Hide();
        }
    }
}
