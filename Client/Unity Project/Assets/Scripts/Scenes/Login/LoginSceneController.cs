using Assets.Scripts.Services.Communication;
using Assets.Scripts.Services.Communication.DTOs.Inbound;
using Assets.Scripts.Services.Communication.DTOs.Outbound;
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

        // Configurable script parameters
        public InputField UsernameInputField;
        public InputField PasswordInputField;
        public Text LoginErrorLabel;
        public Button LoginButton;

        private LoginService loginService;
        private GameControlService gameControlService;

        void Start() {
            loginService = FindObjectOfType<LoginService>();
            loginService.OnLoginSuccess += LoginSuccessCallback;
            loginService.OnLoginFailed += LoginFailedCallback;
            gameControlService = FindObjectOfType<GameControlService>();
            LoginErrorLabel.transform.gameObject.SetActive(false);
            OnInputFieldValueChanged();
        }

        void OnDestroy()
        {
            loginService.OnLoginSuccess -= LoginSuccessCallback;
            loginService.OnLoginFailed -= LoginFailedCallback;
        }

        public void OnExitButtonClick()
        {
            LoadScene(Scenes.Scene.TITLE_SCENE);
        }

        public void OnLoginButtonClick()
        {
            LoginButton.interactable = false;
            loginService.Login(UsernameInputField.text, PasswordInputField.text);
        }

        public void OnInputFieldValueChanged()
        {
            LoginButton.interactable = UsernameInputField.text.Length > 0 && PasswordInputField.text.Length > 0;
        }

        private void LoginFailedCallback(WWW request)
        {
            LoginButton.interactable = true;
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

        private void LoginSuccessCallback(LoginResultDTO loginResultDTO)
        {
            LoginButton.interactable = true;
            LoadScene(Scenes.Scene.MENU_SCENE);
        }
    }
}