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
        public EventSystem eventSystem;
        public Button logOutButton;

        // Private attributes
        private Application application;
        private CommunicationService communicationService;

        // Use this for initialization
        void Start() {
            application = (Application)FindObjectOfType(typeof(Application));
            communicationService = (CommunicationService)FindObjectOfType(typeof(CommunicationService));
        }

        // Update is called once per frame
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
            SceneManager.LoadScene(TITLE_SCENE_NAME);
        }

        private void LogOutCallback(WWW request)
        {
            logOutButton.interactable = true;
            application.ClearUserSession();
            SceneManager.LoadScene(MENU_SCENE_NAME);
        }
    }
}