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

        public EventSystem eventSystem;
        public InputField usernameInputField;
        public InputField passwordInputField;
        public Text loginErrorLabel;
        public Button loginButton;

        private GameController gameController;
        private HttpService httpService;

        void Start() {
            gameController = (GameController)FindObjectOfType(typeof(GameController));
            httpService = (HttpService)FindObjectOfType(typeof(HttpService));
            loginErrorLabel.transform.gameObject.SetActive(false);
        }


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

            httpService.HttpPost(LOGIN_URL, form, LoginCallback);
            loginButton.interactable = false;
        }

        private void LoginCallback(WWW request)
        {
            loginButton.interactable = true;
            if (request.GetStatusCode() == HttpStatusCode.OK || request.GetStatusCode() == 0)
            {
                ProcessSuccessfulLogin(request);
            }
            else {
                ProcessFailedLogin(request);
            }
        }

        private void ProcessFailedLogin(WWW request)
        {
            Debug.Log(String.Format("Error: Response Headers: {0}.", request.responseHeaders.ToFormattatedString()));
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
            gameController.SetUserSession(resultDTO.token, resultDTO.username);
            SceneManager.LoadScene(MENU_SCENE_NAME);
        }
    }
}