﻿using UnityEngine;
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

        // Configurable script parameters
        public EventSystem eventSystem;
        public InputField usernameInputField;
        public InputField passwordInputField;
        public InputField passwordConfirmInputField;
        public InputField emailInputField;
        public Text registrationErrorLabel;
        public RegistrationFormValidationController registrationFormValidationController;
        public Button registerButton;

        //Private attributes
        private Application application;
        private CommunicationService communicationService;

        // Use this for initialization
        void Start()
        {
            application = (Application)FindObjectOfType(typeof(Application));
            communicationService = (CommunicationService)FindObjectOfType(typeof(CommunicationService));

            registrationErrorLabel.transform.gameObject.SetActive(false);
        }

        // Update is called once per frame
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
            if (registrationFormValidationController.Validate(usernameInputField, passwordInputField, passwordConfirmInputField, emailInputField))
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
                registrationErrorLabel.text = request.error;
                registrationErrorLabel.transform.gameObject.SetActive(true);
                return;
            }
            RegistrationResultDTO resultDTO = JsonUtility.FromJson<RegistrationResultDTO>(request.text);
            application.SetUserSession(resultDTO.token, resultDTO.username);
            SceneManager.LoadScene(MENU_SCENE_NAME);
        }
    }
}