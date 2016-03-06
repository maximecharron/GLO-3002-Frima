using UnityEngine;
using UnityEngine.UI;
using System.Collections;

using System;
using Assets.Scripts.Communication;
using Assets.Scripts.Communication.CommandDTOs;

namespace Assets.Scripts.Scenes.Game
{
    public class BossController : MonoBehaviour {

        private const int DEFAULT_ATTACK_VALUE = 10;
        
        public Text healthPointValue;
        public Slider healthPointSlider;
        public ParticleSystem particlesSystem;

        public delegate void BossDeadEventHandler();
        public event BossDeadEventHandler OnBossDead;

        private WebSocketService webSocketService;
        private int currentBossLife = 0;
        

        void Start() {
            webSocketService = FindObjectOfType<WebSocketService>();
            webSocketService.RegisterCommand("bossStatusUpdate", BossStatusUpdateCallback, typeof(BossStatusUpdateCommandDTO));
        }

        void OnDestroy()
        {
            webSocketService.UnregisterCommand("bossStatusUpdate");
        }

        void Update() {
            
        }

        void OnMouseDown()
        {
            UpdateBossLife(currentBossLife - DEFAULT_ATTACK_VALUE);
            webSocketService.SendCommand(new BossAttackCommandDTO(DEFAULT_ATTACK_VALUE));
            playParticlesOnHit();
        }

        private void BossStatusUpdateCallback(CommandDTO commandDTO)
        {
            var bossStatusUpateParams = ((BossStatusUpdateCommandDTO)commandDTO).command.parameters;
            if (bossStatusUpateParams.currentBossLife <= 0 || (BossStatus)bossStatusUpateParams.status == BossStatus.DEAD)
            {
                OnBossDead();
            }
            else
            {
                healthPointSlider.maxValue = bossStatusUpateParams.constantBossLife;
                UpdateBossLife(bossStatusUpateParams.currentBossLife);
            }
        }

        private void UpdateBossLife(int value)
        {
            healthPointSlider.value = value;
            healthPointValue.text = value.ToString();
        }

        private void playParticlesOnHit()
        {
 
            float mousePosX = Input.mousePosition.x - Screen.width / 2;
            float mousePosY = Input.mousePosition.y - Screen.height / 2;
            Vector3 mousePosition = new Vector3(mousePosX, mousePosY, -5);
            particlesSystem.transform.position = mousePosition;
            particlesSystem.Play();
        }
    }
}