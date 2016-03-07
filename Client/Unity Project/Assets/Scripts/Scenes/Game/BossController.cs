using UnityEngine;
using UnityEngine.UI;
using System.Collections;

using System;
using Assets.Scripts.Communication;
using Assets.Scripts.Communication.CommandDTOs;

namespace Assets.Scripts.Scenes.Game
{
    [RequireComponent(typeof(AudioSource))]
    public class BossController : MonoBehaviour {

        private const int DEFAULT_ATTACK_VALUE = 1000;
        
        public Text healthPointValue;
        public Slider healthPointSlider;
        public ParticleSystem hitParticleSystem;
        public AudioClip[] audioClips;

        public delegate void BossDeadEventHandler();
        public event BossDeadEventHandler OnBossDead;

        private WebSocketService webSocketService;
        private int currentBossLife = 0;

        void Start() {
            webSocketService = FindObjectOfType<WebSocketService>();
            webSocketService.RegisterCommand(BossStatusUpdateCommandDTO.COMMAND_NAME, BossStatusUpdateCallback, typeof(BossStatusUpdateCommandDTO));
            healthPointValue.gameObject.SetActive(false);
        }

        void OnDestroy()
        {
            webSocketService.UnregisterCommand(BossStatusUpdateCommandDTO.COMMAND_NAME);
        }

        void OnMouseDown()
        {
            UpdateBossLife(currentBossLife - DEFAULT_ATTACK_VALUE);
            webSocketService.SendCommand(new BossAttackCommandDTO(DEFAULT_ATTACK_VALUE));
            PlayParticlesOnHit();
            PlaySoundOnHit();
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
            if (value > currentBossLife && value - currentBossLife <= DEFAULT_ATTACK_VALUE)
            {
                return;
            } else if (value < 0)
            {
                value = 0;
            }
            currentBossLife = value;
            healthPointSlider.value = value;
            healthPointValue.text = value.ToString();
            healthPointValue.gameObject.SetActive(true);
        }

        private void PlayParticlesOnHit()
        {
            hitParticleSystem.transform.position = Camera.main.GetMousePosition().ToVector3(hitParticleSystem.transform.position.z);
            hitParticleSystem.PlayEnable();
        }

        private void PlaySoundOnHit()
        {
            AudioSource audioSource = GetComponent<AudioSource>();
            int randomAudioClipIndex = Convert.ToInt32(UnityEngine.Random.Range(0, audioClips.Length));
            audioSource.PlayAudioClip(audioClips[randomAudioClipIndex]);
        }
    }
}