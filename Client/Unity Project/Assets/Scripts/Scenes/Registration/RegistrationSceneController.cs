using UnityEngine;
using UnityEngine.EventSystems;
using System.Collections;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using Assets.Scripts.Communication;
using System.Net;
using Assets.Scripts.Communication.DTOs;
using Assets.Scripts.Utils;
using System;

namespace Assets.Scripts.Scenes.Registration
{
    public class RegistrationSceneController : SceneController
    {
        private const string REGISTRATION_URL = "/signup";

        public EventSystem eventSystem;
        public InputField usernameInputField;
        public InputField passwordInputField;
        public InputField passwordConfirmInputField;
        public InputField emailInputField;
        public Text usernameErrorLabel;
        public Text registrationErrorLabel;
        public RegistrationFormValidationController registrationFormValidationController;
        public Button registerButton;

        private Application application;
        private CommunicationService communicationService;

        void Start()
        {
            application = (Application)FindObjectOfType(typeof(Application));
            communicationService = (CommunicationService)FindObjectOfType(typeof(CommunicationService));

            registrationErrorLabel.transform.gameObject.SetActive(false);
        }

        void Update() {

        }

        public void OnExitButtonPointerClick()
        {
            SceneManager.LoadScene(TITLE_SCENE_NAME);
        }

        public void OnRegisterButtonPointerClick()
        {
            Register();
        }

        private void Register()
        {
            if (registrationFormValidationController.Validate())
            {
                WWWForm form = new WWWForm();
                form.AddField("username", usernameInputField.text);
                form.AddField("password", passwordInputField.text);
                form.AddField("email", emailInputField.text);

                communicationService.HttpPost(REGISTRATION_URL, form, RegisterCallback);
                registerButton.interactable = false;
            }
        }

        private void RegisterCallback(WWW request)
        {
            registerButton.interactable = true;
            if (request.GetStatusCode() != HttpStatusCode.OK)
            {
                ProcessFailedRegistration(request);
                return;
            }
            ProcessSuccessfulRegistration(request);
        }

        private void ProcessFailedRegistration(WWW request)
        {
            if (request.GetStatusCode() == HttpStatusCode.Unauthorized)
            {
                usernameErrorLabel.text = "Username already exists.";
                usernameErrorLabel.transform.gameObject.SetActive(true);
            }
            else
            {
                registrationErrorLabel.text = request.error;
                registrationErrorLabel.transform.gameObject.SetActive(true);
            }
        }

        private void ProcessSuccessfulRegistration(WWW request)
        {
            RegistrationResultDTO resultDTO = JsonUtility.FromJson<RegistrationResultDTO>(request.text);
            application.SetUserSession(resultDTO.token, resultDTO.username);
            SceneManager.LoadScene(MENU_SCENE_NAME);
        }
    }
}