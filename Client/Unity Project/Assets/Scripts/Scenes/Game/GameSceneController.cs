using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using Assets.Scripts.Communication;
using Assets.Scripts.Communication.DTOs;
using Assets.Scripts.Scenes.Game.Boss;
using Assets.Scripts.Services;

namespace Assets.Scripts.Scenes.Game
{

    public class GameSceneController : SceneController
    {
        // Configurable script parameters
        public BossController BossController;
        public BossDeathController BossDeathController;
        public GameObject Boss;
        public Canvas GameCanvas;

        public bool AudioEnabled
        {
            get {
                return GetComponent<AudioSource>().enabled;
            }
            set
            {
                GetComponent<AudioSource>().enabled = value;
            }
        }

        private GameControlService gameControlService;

        void Start() {
            gameControlService = FindObjectOfType<GameControlService>();
            gameControlService.GlobalAudioThemeEnabled = false;
            BossDeathController.OnBossDeathEnd += BossDeathEndEventHandler;
        }

        void OnDestroy()
        {
            if (gameControlService != null)
            {
                gameControlService.GlobalAudioThemeEnabled = true;
            }
        }

        public void OnExitButtonClick()
        {
            LoadScene(Scenes.Scene.MENU_SCENE);
        }

        private void BossDeathEndEventHandler()
        {
            LoadScene(Scenes.Scene.VICTORY_SCENE);
        }

        public void PauseGame()
        {
            GameCanvas.gameObject.SetActive(false);
        }

        public void ResumeGame()
        {
            GameCanvas.gameObject.SetActive(true);
        }

    }
}