using Assets.Scripts.Communication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Assets.Scripts.Communication.DTOs;
using Assets.Scripts.Communication.DTOs.Inbound;
using Assets.Scripts.Communication.DTOs.Outbound;
using UnityEngine;

namespace Assets.Scripts.Scenes.Game
{
    class AttackBatchingCommandInterceptor : MonoBehaviour, ICommandInterceptor
    {
        //Configurable script parameters
        public float BatchSendInterval = 0.5f;

        private WebSocketService webSocketService;
        private long postponedAttackValue = 0;
        private float lastBatchSendTime = 0;

        void Start()
        {
            webSocketService = FindObjectOfType<WebSocketService>();
            webSocketService.AddOutboundInterceptor(this, typeof(BossAttackDTO));
            webSocketService.AddInboundInterceptor(this, typeof(BossStatusUpdateDTO));
        }

        void Update()
        {
            if (Time.time - lastBatchSendTime > BatchSendInterval && postponedAttackValue != 0)
            {
                webSocketService.SendCommand(new BossAttackDTO(postponedAttackValue), false);
                postponedAttackValue = 0;
                lastBatchSendTime = Time.time;
            }
        }

        public bool InboundIntercept(CommandDTO commandDTO)
        {
            BossStatusUpdateDTO bossStatusUpdateCommandDTO = (BossStatusUpdateDTO)commandDTO;
            bossStatusUpdateCommandDTO.command.parameters.currentBossLife -= postponedAttackValue;
            return true;
        }

        public bool OutboundIntercept(CommandDTO commandDTO)
        {
            BossAttackDTO bossAttackCommandDTO = (BossAttackDTO)commandDTO;
            postponedAttackValue += bossAttackCommandDTO.command.parameters.number;
            return false;
        }
    }
}
