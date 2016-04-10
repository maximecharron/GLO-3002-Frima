using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using Assets.Scripts.Communication;
using Assets.Scripts.Communication.CommandDTOs;
using Assets.Scripts.Scenes.Game.Boss;

namespace Assets.Scripts.Scenes.Game
{

    public class GameSceneController : SceneController
    {
        // Configurable script parameters
        public WebSocketService WebSocketService;
        public BossController BossController;
        public BossDeathController BossDeathController;
        public GameObject Boss;
        public GameObject LoadingSceneOverlay;
        public Canvas Canvas;

        void Start() {
            //GameController gameController = FindObjectOfType<GameController>();
            //WebSocketService.SessionToken = gameController.SessionToken;
            BossDeathController.OnBossDeathEnd += OnBossDead;
            InitCommunication();
        }

        private void InitCommunication()
        {
            WebSocketService.OnInitializationComplete = OnCommunicationInitializationComplete;
            WebSocketService.RegisterCommand(BossStatusUpdateCommandDTO.COMMAND_NAME, BossController.BossStatusUpdateCallback, typeof(BossStatusUpdateCommandDTO));
            WebSocketService.Init();
        }

        void OnDestroy()
        {
            WebSocketService.UnregisterCommand(BossStatusUpdateCommandDTO.COMMAND_NAME);
        }

        private void OnCommunicationInitializationComplete()
        {
            LoadingSceneOverlay.gameObject.SetActive(false);
        }

        public void OnExitButtonPointerClick()
        {
            SceneManager.LoadScene(MENU_SCENE_NAME);
        }

        private void OnBossDead()
        {
            SceneManager.LoadScene(VICTORY_SCENE_NAME);
        }

    }
}