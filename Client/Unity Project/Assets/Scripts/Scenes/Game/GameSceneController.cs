using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using Assets.Scripts.Services.Communication;
using Assets.Scripts.Services.Communication.DTOs;
using Assets.Scripts.Scenes.Game.Boss;
using Assets.Scripts.Services;
using Assets.Scripts.Services.BossStatus;

namespace Assets.Scripts.Scenes.Game
{
    [RequireComponent(typeof(AudioSource))]
    public class GameSceneController : SceneController
    {
        private const float DEFAULT_AUDIO_VOLUME = 0.8f;

        // Configurable script parameters
        public GameObject Boss;
        public Canvas GameCanvas;

        public bool AudioMuted
        {
            get {
                return GetComponent<AudioSource>().volume == 0f;
            }
            set
            {
                GetComponent<AudioSource>().volume = value ? 0f : DEFAULT_AUDIO_VOLUME;
            }
        }

        private GameControlService gameControlService;

        void Start() {
            gameControlService = FindObjectOfType<GameControlService>();
            gameControlService.GlobalAudioThemeEnabled = false;
            AudioMuted = false;
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

        public void ShowVictoryScene()
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