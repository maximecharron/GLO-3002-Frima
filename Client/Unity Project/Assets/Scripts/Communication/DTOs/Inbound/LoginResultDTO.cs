using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Communication.DTOs.Inbound
{
    class LoginResultDTO
    {
        public String token = "";
        public String username = "";
        public String email = "";
        public Int32 currentXP = 0;
        public Int32 pointNextLevel = 0;
        public Int32 XPNextLevel = 0;
        public Int32 level = 0;
        public Int32 stamina = 0;
        public Int32 hype = 0;
        public Int32 attack = 0;
    }
}
