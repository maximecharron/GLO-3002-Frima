using Assets.Scripts.Communication;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Assets.Scripts.Communication.CommandDTOs;
using UnityEngine;

namespace Assets.Scripts.Scenes.Game
{
    class AttackBatchingCommandInterceptor : MonoBehaviour, ICommandInterceptor
    {
        //Configurable script parameters
        public float BatchSendInterval = 0.5f;

        private WebSocketService webSocketService;
        private int postponedAttackValue = 0;
        private float lastBatchSendTime = 0;

        void Start()
        {
            webSocketService = FindObjectOfType<WebSocketService>();
            webSocketService.AddSendInterceptor(this, typeof(BossAttackDTO));
            webSocketService.AddReceiveInterceptor(this, typeof(BossStatusUpdateDTO));
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

        public bool ReceiveIntercept(CommandDTO commandDTO)
        {
            BossStatusUpdateDTO bossStatusUpdateCommandDTO = (BossStatusUpdateDTO)commandDTO;
            bossStatusUpdateCommandDTO.command.parameters.currentBossLife -= postponedAttackValue;
            return true;
        }

        public bool SendIntercept(CommandDTO commandDTO)
        {
            BossAttackDTO bossAttackCommandDTO = (BossAttackDTO)commandDTO;
            postponedAttackValue += bossAttackCommandDTO.command.parameters.number;
            return false;
        }
    }
}
