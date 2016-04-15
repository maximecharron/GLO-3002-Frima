using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using Assets.Scripts.Communication;
using Assets.Scripts.Communication.CommandDTOs;
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
        public GameObject LoadingSceneOverlay;
        public Canvas Canvas;

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
            BossDeathController.OnBossDeathStart += OnBossDeathStartCallback;
            BossDeathController.OnBossDeathEnd += OnBossDeathEndCallback;
        }

        void OnDestroy()
        {
            if (gameControlService != null)
            {
                gameControlService.GlobalAudioThemeEnabled = true;
            }
        }

        public void OnExitButtonPointerClick()
        {
            LoadScene(Scenes.Scene.MENU_SCENE);
        }

        private void OnBossDeathStartCallback()
        {
            
        }

        private void OnBossDeathEndCallback()
        {
            LoadScene(Scenes.Scene.VICTORY_SCENE);
        }

    }
}