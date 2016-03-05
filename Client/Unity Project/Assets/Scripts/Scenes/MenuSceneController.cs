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

        public EventSystem eventSystem;
        public Button logOutButton;

        private Application application;
        private CommunicationService communicationService;

        void Start() {
            application = (Application)FindObjectOfType(typeof(Application));
            communicationService = (CommunicationService)FindObjectOfType(typeof(CommunicationService));
        }

        void Update() {

        }

        public void OnJoinGameButtonPointerClick()
        {
            SceneManager.LoadScene(GAME_SCENE_NAME);
        }

        public void OnLogOutButtonPointerClick()
        {
            communicationService.HttpGet(LOGOUT_URL, LogOutCallback);
            logOutButton.interactable = false;
        }

        private void LogOutCallback(WWW request)
        {
            logOutButton.interactable = true;
            application.ClearUserSession();
            SceneManager.LoadScene(TITLE_SCENE_NAME);
        }
    }
}