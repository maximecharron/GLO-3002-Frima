using Assets.Scripts.Scenes.Game.Boss;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Services
{
    public class GameStatisticsService : MonoBehaviour
    {
        public TimeSpan BossLifeSpan {get { return bossLifeSpan; } set { bossLifeSpan = value; }}
        private TimeSpan bossLifeSpan;

        private GameStatisticsService instance;

        void Awake()
        {
            if (instance == null)
            {
                instance = this;
            }
            else
            {
                Destroy(this.gameObject);
            }
            DontDestroyOnLoad(this.gameObject);
        }
    }


}
