using Assets.Scripts.Scenes.Game.Boss;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts
{
    public class GameStatisticsController : MonoBehaviour
    {
        public DateTime BossCreationDate {get; set;}
        public DateTime BossKillDate { get; set; }
        public TimeSpan BossLifeSpan {
            get {
                return BossKillDate - BossCreationDate;
            }
        }

        private BossController BossController;
        private BossDeathController BossDeathController;

        void Start()
        {
            DontDestroyOnLoad(this.gameObject);
        }

        void Update()
        {
            BossController = FindObjectOfType<BossController>();
            if (BossController != null)
            {
                BossController.OnBossInitComplete -= OnBossInitCompleteCallback;
                BossController.OnBossInitComplete += OnBossInitCompleteCallback;
            }
            BossDeathController = FindObjectOfType<BossDeathController>();
            if (BossController != null) {
                BossDeathController.OnBossDeathEnd -= OnBossDeadCallback;
                BossDeathController.OnBossDeathEnd += OnBossDeadCallback;
            }
        }

        private void OnBossDeadCallback()
        {
            this.BossKillDate = DateTime.Now;
        }
        
        private void OnBossInitCompleteCallback()
        {
            this.BossCreationDate = BossController.CreationDate;
        }
    }


}
