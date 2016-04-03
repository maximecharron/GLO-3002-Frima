using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Scenes.Game
{
    public class GameStatisticsController : MonoBehaviour
    {
        public DateTime BossCreationDate {get; set;}
        public DateTime BossKillDate { get; set; }
        public BossController BossController;

        void Start()
        {
            DontDestroyOnLoad(this.gameObject);
            BossController.OnBossCreationDateUpdate += OnBossCreationDateUpdateCallback;
            BossController.OnBossDead += OnBossDeadCallback;
        }

        private void OnBossDeadCallback()
        {
            this.BossKillDate = DateTime.Now;
        }
        
        private void OnBossCreationDateUpdateCallback(DateTime bossCreationDate)
        {
            this.BossCreationDate = bossCreationDate;
        }

        public TimeSpan CalculateBossKillTime()
        {
            return BossKillDate - BossCreationDate;
        }
    }


}
