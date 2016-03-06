using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using Assets.Scripts.Communication;
using Assets.Scripts.Communication.CommandDTOs;

namespace Assets.Scripts.Scenes.Game
{

    public class GameSceneController : SceneController
    {
        public WebSocketService webSocketService;
        public BossController bossController;

        void Start() {
            Application application = FindObjectOfType<Application>();
            webSocketService.sessionToken = application.sessionToken;
            bossController.OnBossDead += OnBossDead;

            webSocketService.Init();
        }

        void Update() {

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