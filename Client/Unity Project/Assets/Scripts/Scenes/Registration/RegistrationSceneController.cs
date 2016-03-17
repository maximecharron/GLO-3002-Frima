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
using Assets.Scripts.Extensions;

namespace Assets.Scripts.Scenes.Registration
{
    public class RegistrationSceneController : SceneController
    {
        private const string REGISTRATION_URL = "/signup";

        // Configurable script parameters
        public InputField UsernameInputField;
        public InputField PasswordInputField;
        public InputField PasswordConfirmInputField;
        public InputField EmailInputField;
        public Text UsernameErrorLabel;
        public Text RegistrationErrorLabel;
        public RegistrationFormValidationController FormValidationController;
        public Button RegisterButton;

        private GameController GameController;
        private HttpService HttpService;

        void Start()
        {
            GameController = (GameController)FindObjectOfType(typeof(GameController));
            HttpService = (HttpService)FindObjectOfType(typeof(HttpService));

            RegistrationErrorLabel.transform.gameObject.SetActive(false);
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
            if (FormValidationController.Validate())
            {
                WWWForm form = new WWWForm();
                form.AddField("username", UsernameInputField.text);
                form.AddField("password", PasswordInputField.text);
                form.AddField("email", EmailInputField.text);

                HttpService.HttpPost(REGISTRATION_URL, form, RegisterCallback);
                RegisterButton.interactable = false;
            }
        }

        private void RegisterCallback(WWW request)
        {
            RegisterButton.interactable = true;
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
                UsernameErrorLabel.text = "Username already exists.";
                UsernameErrorLabel.transform.gameObject.SetActive(true);
            }
            else
            {
                RegistrationErrorLabel.text = request.error;
                RegistrationErrorLabel.transform.gameObject.SetActive(true);
            }
        }

        private void ProcessSuccessfulRegistration(WWW request)
        {
            RegistrationResultDTO resultDTO = JsonUtility.FromJson<RegistrationResultDTO>(request.text);
            GameController.SetUserSession(resultDTO.token, resultDTO.username);
            SceneManager.LoadScene(MENU_SCENE_NAME);
        }
    }
}