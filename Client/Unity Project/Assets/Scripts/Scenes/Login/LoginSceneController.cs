using Assets.Scripts.Communication;
using Assets.Scripts.Communication.DTOs;
using Assets.Scripts.Extensions;
using Assets.Scripts.Services;
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
        public InputField UsernameInputField;
        public InputField PasswordInputField;
        public Text LoginErrorLabel;
        public Button LoginButton;

        private GameControlService gameControlService;
        private HttpService httpService;

        void Start() {
            gameControlService = FindObjectOfType<GameControlService>();
            httpService = FindObjectOfType<HttpService>();
            LoginErrorLabel.transform.gameObject.SetActive(false);
        }


        public void OnExitButtonPointerClick()
        {
            LoadScene(Scenes.Scene.TITLE_SCENE);
        }

        public void OnLoginButtonPointerClick()
        {
            Login();
        }

        public void OnInputFieldValueChanged()
        {
            LoginButton.interactable = UsernameInputField.text.Length > 0 && PasswordInputField.text.Length > 0;
        }

        private void Login()
        {
            WWWForm form = new WWWForm();
            form.AddField("username", UsernameInputField.text);
            form.AddField("password", PasswordInputField.text);

            httpService.HttpPost(LOGIN_URL, form, LoginCallback);
            LoginButton.interactable = false;
        }

        private void LoginCallback(WWW request)
        {
            LoginButton.interactable = true;
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
            if (request.GetStatusCode() == HttpStatusCode.Unauthorized)
            {
                LoginErrorLabel.text = "Invalid username or password.";
            }
            else
            {
                LoginErrorLabel.text = request.error;
            }
            LoginErrorLabel.transform.gameObject.SetActive(true);
        }

        private void ProcessSuccessfulLogin(WWW request)
        {
            LoginResultDTO resultDTO = JsonUtility.FromJson<LoginResultDTO>(request.text);
            gameControlService.SetUserSession(resultDTO.token, resultDTO.username);
            LoadScene(Scenes.Scene.MENU_SCENE);
        }
    }
}