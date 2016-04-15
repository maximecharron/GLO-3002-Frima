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
        public BossController BossController;
        public BossDeathController BossDeathController;
        public GameObject Boss;
        public GameObject LoadingSceneOverlay;
        public Canvas Canvas;

        private GameController gameController;
        private WebSocketService webSocketService;

        void Start() {
            gameController = FindObjectOfType<GameController>();
            gameController.GameAudioEnabled = true;
            BossDeathController.OnBossDeathStart += OnBossDeathStartCallback;
            BossDeathController.OnBossDeathEnd += OnBossDeathEndCallback;
            InitCommunication();
        }

        private void InitCommunication()
        {
            webSocketService = FindObjectOfType<WebSocketService>();
            webSocketService.RegisterCommand(BossStatusUpdateCommandDTO.COMMAND_NAME, BossController.BossStatusUpdateCallback, typeof(BossStatusUpdateCommandDTO));
        }

        void Destroy()
        {
            gameController.GameAudioEnabled = false;
            CloseCommunication();
        }

        private void CloseCommunication()
        {
            webSocketService.UnregisterCommand(BossStatusUpdateCommandDTO.COMMAND_NAME);
        }

        private void OnCommunicationInitializationComplete()
        {
            LoadingSceneOverlay.gameObject.SetActive(false);
        }

        public void OnExitButtonPointerClick()
        {
            SceneManager.LoadScene(MENU_SCENE_NAME);
        }

        private void OnBossDeathStartCallback()
        {
            CloseCommunication();
        }

        private void OnBossDeathEndCallback()
        {
            SceneManager.LoadScene(VICTORY_SCENE_NAME);
        }

    }
}