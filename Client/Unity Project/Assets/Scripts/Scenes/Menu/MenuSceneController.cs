using Assets.Scripts.Communication;
using Assets.Scripts.Services;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes
{
    public class MenuSceneController : SceneController
    {
        private const string LOGOUT_URL = "/logout";

        // Configurable script parameters
        public Button LogOutButton;

        private GameControlService gameController;
        private HttpService httpService;

        void Start() {
            gameController = FindObjectOfType<GameControlService>();
            httpService = FindObjectOfType<HttpService>();
        }

        public void OnJoinGameButtonPointerClick()
        {
            LoadScene(Scenes.Scene.GAME_SCENE);
        }

        public void OnLogOutButtonPointerClick()
        {
            httpService.HttpGet(LOGOUT_URL, LogOutCallback);
            LogOutButton.interactable = false;
        }

        private void LogOutCallback(WWW request)
        {
            LogOutButton.interactable = true;
            gameController.ClearUserSession();
            LoadScene(Scenes.Scene.TITLE_SCENE);
        }
    }
}