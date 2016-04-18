using UnityEngine;
using Assets.Scripts.Communication;
using Assets.Scripts.Extensions;
using UnityEngine.SceneManagement;
using Assets.Scripts.Communication.DTOs;
using Assets.Scripts.Communication.DTOs.Inbound;
using Assets.Scripts.Communication.DTOs.Outbound;

namespace Assets.Scripts.Services
{

#pragma warning disable CS0618

    [RequireComponent(typeof(AudioSource))]
    public class GameControlService : MonoBehaviour
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

        private static GameControlService instance;

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
            httpService = FindObjectOfType<HttpService>();
            webSocketService = FindObjectOfType<WebSocketService>();
            loginService = FindObjectOfType<LoginService>();
            webSocketService.RegisterCommand(GameConfigUpdateDTO.COMMAND_NAME, GameConfigUpdateCallback, typeof(GameConfigUpdateDTO));
        }

        public void GameConfigUpdateCallback(CommandDTO commandDTO)
        {
            var gameConfigUpdateParams = ((GameConfigUpdateDTO)commandDTO).command.parameters;
            baseBossDamage = gameConfigUpdateParams.baseDamage;
        }

    }
}