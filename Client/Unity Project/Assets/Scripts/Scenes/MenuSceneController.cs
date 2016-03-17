using Assets.Scripts.Communication;
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

        private GameController gameController;
        private HttpService httpService;

        void Start() {
            gameController = (GameController)FindObjectOfType(typeof(GameController));
            httpService = (HttpService)FindObjectOfType(typeof(HttpService));
        }

        public void OnJoinGameButtonPointerClick()
        {
            SceneManager.LoadScene(GAME_SCENE_NAME);
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
            SceneManager.LoadScene(TITLE_SCENE_NAME);
        }
    }
}