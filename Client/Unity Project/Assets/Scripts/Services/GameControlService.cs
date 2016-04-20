﻿using UnityEngine;
using Assets.Scripts.Services.Communication;
using Assets.Scripts.Extensions;
using UnityEngine.SceneManagement;
using Assets.Scripts.Services.Communication.DTOs;
using Assets.Scripts.Services.Communication.DTOs.Inbound;
using Assets.Scripts.Services.Communication.DTOs.Outbound;

namespace Assets.Scripts.Services
{

#pragma warning disable CS0618

    [RequireComponent(typeof(AudioSource))]
    public class GameControlService : MonoSingleton
    {
        private HttpService httpService;
        private WebSocketService webSocketService;
        private LoginService loginService;

        public bool GlobalAudioThemeEnabled
        {
            get { return GetComponent<AudioSource>().enabled; }
            set { GetComponent<AudioSource>().enabled = value; }
        }

        public int BaseBossDamage { get { return baseBossDamage; } }
        private int baseBossDamage;
        public int HypeAttackDamage { get { return hypeAttackDamage; } }
        private int hypeAttackDamage;

        void Start()
        {
            httpService = FindObjectOfType<HttpService>();
            webSocketService = FindObjectOfType<WebSocketService>();
            loginService = FindObjectOfType<LoginService>();
            webSocketService.RegisterCommand(GameConfigUpdateDTO.COMMAND_NAME, GameConfigUpdateCallback, typeof(GameConfigUpdateDTO));
        }

        public void GameConfigUpdateCallback(CommandDTO commandDTO)
        {
            var gameConfigUpdateParams = ((GameConfigUpdateDTO)commandDTO).command.parameters;
            baseBossDamage = gameConfigUpdateParams.baseDamage;
            hypeAttackDamage = gameConfigUpdateParams.ultimateDamage;
        }

    }
}