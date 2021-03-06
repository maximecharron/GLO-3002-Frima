﻿using Assets.Scripts.Services.Communication;
using Assets.Scripts.Services.Communication.DTOs;
using Assets.Scripts.Services.Communication.DTOs.Inbound;
using UnityEngine;

namespace Assets.Scripts.Services
{

#pragma warning disable CS0618

    [RequireComponent(typeof(AudioSource))]
    public class GameControlService : MonoSingleton
    {
        private HttpService httpService;
        private WebSocketService webSocketService;

        public bool GlobalAudioThemeEnabled
        {
            get { return GetComponent<AudioSource>().enabled; }
            set { GetComponent<AudioSource>().enabled = value; }
        }

        public int BaseBossDamage { get { return baseBossDamage; } }
        private int baseBossDamage = 1;
        public int HypeAttackDamage { get { return hypeAttackDamage; } }
        private int hypeAttackDamage = 1;
        public int BaseExperienceIncreaseOnHit { get { return baseExperienceIncreaseOnHit; } }
        private int baseExperienceIncreaseOnHit = 1;
        public int MaximumLevel { get { return maximumLevel; } }
        private int maximumLevel = 1;

        void Start()
        {
            httpService = FindObjectOfType<HttpService>();
            webSocketService = FindObjectOfType<WebSocketService>();
            webSocketService.RegisterCommand(GameConfigUpdateDTO.COMMAND_NAME, GameConfigUpdateCallback, typeof(GameConfigUpdateDTO));
        }

        public void GameConfigUpdateCallback(CommandDTO commandDTO)
        {
            var gameConfigUpdateParams = ((GameConfigUpdateDTO)commandDTO).command.parameters;
            baseBossDamage = gameConfigUpdateParams.baseAttackDamage;
            hypeAttackDamage = gameConfigUpdateParams.hypeAttackDamage;
            baseExperienceIncreaseOnHit = gameConfigUpdateParams.baseExperienceIncreaseOnHit;
            maximumLevel = gameConfigUpdateParams.maximumLevel;
        }

    }
}