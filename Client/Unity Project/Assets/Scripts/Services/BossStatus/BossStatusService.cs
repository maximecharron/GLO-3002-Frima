using Assets.Scripts.Services.Communication;
using Assets.Scripts.Services.Communication.DTOs;
using Assets.Scripts.Services.Communication.DTOs.Inbound;
using Assets.Scripts.Services.Communication.DTOs.Outbound;
using Assets.Scripts.Utils;
using System;

namespace Assets.Scripts.Services.BossStatus
{
    class BossStatusService : MonoSingleton
    {
        public delegate void BossStatusUpdateEventHandler();
        public event BossStatusUpdateEventHandler OnBossStatusUpdate = delegate { };
        public delegate void BossDeadEventHandler();
        public event BossDeadEventHandler OnBossDead = delegate { };

        private WebSocketService webSocketService;
        private GameStatisticsService gameStatisticsService;
        private BossStatusService instance;

        public string BossName { get { return bossName; } }
        private string bossName = "";
        public long CurrentBossLife
        {
            get { return currentBossLife; }
            set
            {
                webSocketService.SendCommand(new BossAttackDTO(currentBossLife - value));
                currentBossLife = Math.Max(value, 0);
                FireCallbacks();
            }
        }
        private long currentBossLife = 10000;
        public long MaximumBossLife { get { return maximumBossLife; } }
        private long maximumBossLife = 10000;
        public BossStatus BossStatus { get { return status; } }
        private BossStatus status = 0;
        public DateTime CreationDate { get { return creationDate; } }
        private DateTime creationDate = DateTime.Now;

        void Start()
        {
            gameStatisticsService = FindObjectOfType<GameStatisticsService>();
            webSocketService = FindObjectOfType<WebSocketService>();
            webSocketService.RegisterCommand(BossStatusUpdateDTO.COMMAND_NAME, BossStatusUpdateCallback, typeof(BossStatusUpdateDTO));
        }

        void OnDestroy()
        {
            if (webSocketService != null)
            {
                webSocketService.UnregisterCommand(BossStatusUpdateDTO.COMMAND_NAME, BossStatusUpdateCallback);
            }
        }

        private void BossStatusUpdateCallback(CommandDTO commandDTO)
        {
            var bossStatusUpdateParams = ((BossStatusUpdateDTO)commandDTO).command.parameters;
            bossName = bossStatusUpdateParams.bossName;
            currentBossLife = Math.Max(bossStatusUpdateParams.currentBossLife, 0L);
            maximumBossLife = bossStatusUpdateParams.maximumBossLife;
            status = (BossStatus)bossStatusUpdateParams.status;
            creationDate = DateTimeUtils.ConvertFromJavaScriptDate(bossStatusUpdateParams.creationDate);
            FireCallbacks();
        }

        private void FireCallbacks()
        {
            if (CurrentBossLife <= 0 || BossStatus == BossStatus.DEAD)
            {
                gameStatisticsService.BossLifeSpan = DateTime.Now - creationDate;
                OnBossDead();
            }
            else
            {
                OnBossStatusUpdate();
            }
        }
    }
}
