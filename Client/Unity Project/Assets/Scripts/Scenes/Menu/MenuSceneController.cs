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

        // Configurable script parameters
        public Button LogOutButton;

        private LoginService loginService;

        void Start() {
            loginService = FindObjectOfType<LoginService>();
            loginService.OnLogoutSuccess += LogOutSuccessCallback;
        }

        public void OnJoinGameButtonClick()
        {
            LoadScene(Scenes.Scene.GAME_SCENE);
        }

        public void OnLogOutButtonClick()
        {
            LogOutButton.interactable = false;
            loginService.LogOut();
        }

        private void LogOutSuccessCallback(WWW request)
        {
            LogOutButton.interactable = true;
            LoadScene(Scenes.Scene.TITLE_SCENE);
        }
    }
}