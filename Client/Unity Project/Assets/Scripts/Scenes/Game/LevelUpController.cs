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
    [RequireComponent(typeof(AudioSource))]
    class LevelUpController : MonoBehaviour
    {
        //Configurable script parameters
        public GameSceneController GameSceneController;
        public Canvas LevelUpCanvas;
        public Text CurrentExperienceText;
        public Text UpgradeExplanationText;
        public Text StaminaPowerLevelText;
        public Text HypePowerLevelText;
        public Text AttackPowerLevelText;
        public AudioClip UpgradePointClickAudioClip;
        public AudioClip RevertButtonClickAudioClip;
        public Button RevertButton;
        public Button ContinueButton;

        private PlayerPropertyService playerPropertyService;
        private AudioSource audioSource;
        private int staminaPowerLevelUpgrade = 0;
        private int hypePowerLevelUpgrade = 0;
        private int attackPowerLevelUpgrade = 0;

        void Start()
        {
            audioSource = GetComponent<AudioSource>();
            playerPropertyService = FindObjectOfType<PlayerPropertyService>();
            playerPropertyService.OnLevelUp += LevelUpCallback;
            Hide();
        }

        void OnDestroy()
        {
            playerPropertyService.OnLevelUp -= LevelUpCallback;
        }

        private void ShowPanel()
        {
            GameSceneController.PauseGame();
            LevelUpCanvas.gameObject.SetActive(true);
        }

        private void Hide()
        {
            GameSceneController.ResumeGame();
            LevelUpCanvas.gameObject.SetActive(false);
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
            audioSource.PlayAudioClip(UpgradePointClickAudioClip);
            UpdateLabels();
            UpdateButtonsState();
        }

        public void OnRevertButtonClick()
        {
            InitState();
            audioSource.PlayAudioClip(RevertButtonClickAudioClip);
        }

        public void OnContinueButtonClick()
        {
            playerPropertyService.Upgrade(staminaPowerLevelUpgrade, hypePowerLevelUpgrade, attackPowerLevelUpgrade);
            Hide();
        }
    }
}
