using UnityEngine;
using System.Collections;
using Assets.Scripts.Services.Communication;
using Assets.Scripts.Services.Communication.DTOs;
using Assets.Scripts.Services.Communication.DTOs.Inbound;
using Assets.Scripts.Services.Communication.DTOs.Outbound;

namespace Assets.Scripts.Services
{
    public class PlayerPropertyService : MonoSingleton
    {
        public delegate void PlayerPropertiesUpdateUpdateEventHandler();
        public event PlayerPropertiesUpdateUpdateEventHandler OnPlayerPropertiesUpdate = delegate { };
        public delegate void OnLevelUpEventHandler();
        public event OnLevelUpEventHandler OnLevelUp = delegate { };

        private WebSocketService webSocketService;
        private GameControlService gameControlService;
        private LoginService loginService;
        public int ExperiencePoints { get { return experiencePoints; } }
        private int experiencePoints = 0;
        private int updatedExperiencePoints = 0;
        public int UpgradePointsOnLevelComplete { get { return upgradePointsOnLevelComplete; } }
        private int upgradePointsOnLevelComplete = 0;
        public int RequiredExperiencePointsForNextLevel { get { return requiredExperiencePointsForNextLevel; } }
        private int requiredExperiencePointsForNextLevel = 0;
        public int Level { get { return level; } }
        private int level;
        public int StaminaPowerLevel { get { return staminaPowerLevel; } }
        private int staminaPowerLevel;
        public int HypePowerLevel { get { return hypePowerLevel; } }
        private int hypePowerLevel;
        public int AttackPowerLevel { get { return attackPowerlevel; } }
        private int attackPowerlevel;

        void Start()
        {
            loginService = FindObjectOfType<LoginService>();
            loginService.OnLoginSuccess += LoginSuccessCallback;
            webSocketService = FindObjectOfType<WebSocketService>();
            gameControlService = FindObjectOfType<GameControlService>();
            webSocketService.RegisterCommand(PlayerLevelUpDTO.COMMAND_NAME, PlayerLevelUpCallback, typeof(PlayerLevelUpDTO));
            InvokeRepeating("UploadExperiencePointsToServer", 5, 5);
        }

        private void UploadExperiencePointsToServer()
        {
            if (experiencePoints != 0 && experiencePoints != updatedExperiencePoints) {
                webSocketService.SendCommand(new ExperiencePointsUpdateDTO(experiencePoints));
                updatedExperiencePoints = experiencePoints;
            }
        }

        private void LoginSuccessCallback(LoginResultDTO resultDTO)
        {
            experiencePoints = resultDTO.currentXP;
            updatedExperiencePoints = experiencePoints;
            upgradePointsOnLevelComplete = resultDTO.pointNextLevel;
            requiredExperiencePointsForNextLevel = resultDTO.XPNextLevel;
            level = resultDTO.level;
            staminaPowerLevel = resultDTO.stamina;
            hypePowerLevel = resultDTO.hype;
            attackPowerlevel = resultDTO.attack;
            OnPlayerPropertiesUpdate();
        }

        private void PlayerLevelUpCallback(CommandDTO commandDTO)
        {
            var playerLevelUpParams = ((PlayerLevelUpDTO)commandDTO).command.parameters;
            requiredExperiencePointsForNextLevel = playerLevelUpParams.nextLevelXp;
            upgradePointsOnLevelComplete = playerLevelUpParams.pointForNextLevel;
            OnPlayerPropertiesUpdate();
        }

        public void IncreaseExperiencePoints()
        {
            experiencePoints += gameControlService.BaseExperienceIncreaseOnHit;
            if (experiencePoints >= requiredExperiencePointsForNextLevel)
            {
                level += 1;
                OnLevelUp();
            }
            OnPlayerPropertiesUpdate();
        }

        public void Upgrade(int staminaPowerLevelUpgrade, int hypePowerLevelUpgrade, int attackPowerLevelUpgrade)
        {
            webSocketService.SendCommand(new PlayerPropertiesUpdateDTO(experiencePoints, level, staminaPowerLevelUpgrade, hypePowerLevelUpgrade, attackPowerLevelUpgrade));
            staminaPowerLevel += staminaPowerLevelUpgrade;
            hypePowerLevel += hypePowerLevelUpgrade;
            attackPowerlevel += attackPowerLevelUpgrade;
        }

    }
}