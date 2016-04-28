using System;

namespace Assets.Scripts.Services
{
    public class GameStatisticsService : MonoSingleton
    {
        public TimeSpan BossLifeSpan {get { return bossLifeSpan; } set { bossLifeSpan = value; }}
        private TimeSpan bossLifeSpan;
    }


}
