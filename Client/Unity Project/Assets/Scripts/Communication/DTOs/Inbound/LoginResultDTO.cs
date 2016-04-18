using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.DTOs.Inbound
{
    class LoginResultDTO
    {
        public string token = "";
        public string username = "";
        public string email = "";
        public int currentXP = 0;
        public int pointNextLevel = 0;
        public int XPNextLevel = 0;
        public int level = 0;
        public int stamina = 0;
        public int hype = 0;
        public int attack = 0;
    }
}
