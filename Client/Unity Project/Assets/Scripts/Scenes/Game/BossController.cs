using UnityEngine;
using UnityEngine.UI;
using System.Collections;

using System;
using Assets.Scripts.Communication;
using Assets.Scripts.Communication.CommandDTOs;

namespace Assets.Scripts.Scenes.Game
{
    public class BossController : MonoBehaviour {

        public Text healthPointValue;
        public Slider healthPointSlider;

        public delegate void BossDeadEventHandler();
        public event BossDeadEventHandler OnBossDead;

        private CommunicationService communicationService;

        void Start() {
            communicationService = (CommunicationService)FindObjectOfType(typeof(CommunicationService));
            communicationService.RegisterCommand("bossStatusUpdate", BossStatusUpdateCallback, typeof(BossStatusUpdateCommandDTO));
        }

        void OnDestroy()
        {
            communicationService.UnregisterCommand("bossStatusUpdate");
        }

        void Update() {
            
        }

        void OnMouseDown()
        {
            communicationService.SendCommand(new BossAttackCommandDTO(10));
        }

        private void BossStatusUpdateCallback(CommandDTO commandDTO)
        {
            var bossStatusUpateParams = ((BossStatusUpdateCommandDTO)commandDTO).command.parameters;
            if (bossStatusUpateParams.currentBossLife == 0)
            {
                OnBossDead();
            }
            else
            {
                healthPointSlider.maxValue = bossStatusUpateParams.constantBossLife;
                healthPointSlider.value = bossStatusUpateParams.currentBossLife / bossStatusUpateParams.constantBossLife * 100;
            }
        }
    }
}