using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Services.Communication.DTOs.Inbound
{
    class LoginResultDTO
    {
        public string token = "";
        public string username = "";
        public string email = "";
        public int experiencePoints = 0;
        public int upgradePointsOnLevelComplete = 0;
        public int requiredExperiencePointsForNextLevel = 0;
        public int level = 0;
        public int staminaPowerLevel = 0;
        public int hypePowerLevel = 0;
        public int attackPowerLevel = 0;
        public List<LootItemDTO> items = new List<LootItemDTO>();
    }
}
