using Assets.Scripts.Communication;
using Assets.Scripts.Communication.DTOs;
using System;
using System.Net;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes
{

    public class LoginSceneController : SceneController {

        private const string LOGIN_URL = "/login";

        // Configurable script parameters
        public EventSystem eventSystem;
        public InputField usernameInputField;
        public InputField passwordInputField;
        public Text loginErrorLabel;
        public Button loginButton;

        // Private attributes
        private Application application;
        private CommunicationService communicationService;

        // Use this for initialization
        void Start() {
            application = (Application)FindObjectOfType(typeof(Application));
            communicationService = (CommunicationService)FindObjectOfType(typeof(CommunicationService));

            loginErrorLabel.transform.gameObject.SetActive(false);
        }


        // Update is called once per frame
        void Update() {

        }

        public void OnExitButtonPointerClick()
        {
            SceneManager.LoadScene(TITLE_SCENE_NAME);
        }

        public void OnLoginButtonPointerClick()
        {
            Login();
        }

        private void Login()
        {
            WWWForm form = new WWWForm();
            form.AddField("username", usernameInputField.text);
            form.AddField("password", passwordInputField.text);

            communicationService.HttpPost(LOGIN_URL, form, LoginCallback);
            loginButton.interactable = false;
        }

        private void LoginCallback(WWW request)
        {
            loginButton.interactable = true;
            if (request.GetStatusCode() != HttpStatusCode.OK)
            {
                ProcessFailedLogin(request);
                return;
            }
            ProcessSuccessfulLogin(request);
        }

        private void ProcessFailedLogin(WWW request)
        {
            if (request.GetStatusCode() == HttpStatusCode.Unauthorized)
            {
                loginErrorLabel.text = "Invalid username or password.";
            }
            else
            {
                loginErrorLabel.text = request.error;
            }
            loginErrorLabel.transform.gameObject.SetActive(true);
        }

        private void ProcessSuccessfulLogin(WWW request)
        {
            LoginResultDTO resultDTO = JsonUtility.FromJson<LoginResultDTO>(request.text);
            application.SetUserSession(resultDTO.token, resultDTO.username);
            SceneManager.LoadScene(MENU_SCENE_NAME);
        }
    }
}