using Assets.Scripts.Communication;
using Assets.Scripts.Communication.DTOs;
using Assets.Scripts.Communication.DTOs.Inbound;
using Assets.Scripts.Communication.DTOs.Outbound;
using Assets.Scripts.Scenes.Game.Boss;
using Assets.Scripts.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Services.BossStatus
{
    class BossStatusService : MonoBehaviour
    {
        public delegate void BossStatusUpdateEventHandler();
        public event BossStatusUpdateEventHandler OnBossStatusUpdate = delegate { };
        public delegate void BossDeadEventHandler();
        public event BossDeadEventHandler OnBossDead = delegate { };

        private WebSocketService webSocketService;
        private GameStatisticsService gameStatisticsService;
        private BossStatusService instance;

        public String BossName { get { return bossName; } }
        private String bossName = "";
        public int CurrentBossLife
        {
            get { return currentBossLife; }
            set
            {
                webSocketService.SendCommand(new BossAttackDTO(currentBossLife - value));
                currentBossLife = Math.Max(value, 0);
                FireCallbacks();
            }
        }
        private int currentBossLife = 10000;
        public int MaximumBossLife { get { return maximumBossLife; } }
        private int maximumBossLife = 10000;
        public BossStatus BossStatus { get { return status; } }
        private BossStatus status = 0;
        public DateTime CreationDate { get { return creationDate; } }
        private DateTime creationDate = DateTime.Now;

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

        void Start()
        {
            gameStatisticsService = FindObjectOfType<GameStatisticsService>();
            webSocketService = FindObjectOfType<WebSocketService>();
            webSocketService.RegisterCommand(BossStatusUpdateDTO.COMMAND_NAME, this.BossStatusUpdateCallback, typeof(BossStatusUpdateDTO));
        }

        void OnDestroy()
        {
            webSocketService.UnregisterCommand(BossStatusUpdateDTO.COMMAND_NAME, this.BossStatusUpdateCallback);
        }

        private void BossStatusUpdateCallback(CommandDTO commandDTO)
        {
            var bossStatusUpdateParams = ((BossStatusUpdateDTO)commandDTO).command.parameters;
            this.bossName = bossStatusUpdateParams.bossName;
            this.currentBossLife = Math.Max(bossStatusUpdateParams.currentBossLife, 0);
            this.maximumBossLife = bossStatusUpdateParams.maximumBossLife;
            this.status = (BossStatus)bossStatusUpdateParams.status;
            this.creationDate = DateTimeUtils.ConvertFromJavaScriptDate(bossStatusUpdateParams.creationDate);
            FireCallbacks();
        }

        private void FireCallbacks()
        {
            if (CurrentBossLife <= 0 || BossStatus == BossStatus.DEAD)
            {
                gameStatisticsService.BossLifeSpan = DateTime.Now - this.creationDate;
                OnBossDead();
            }
            else
            {
                OnBossStatusUpdate();
            }
        }
    }
}
