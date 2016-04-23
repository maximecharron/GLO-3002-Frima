﻿using UnityEngine;
using UnityEngine.EventSystems;
using System.Collections;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using Assets.Scripts.Services.Communication;
using System.Net;
using Assets.Scripts.Services.Communication.DTOs.Outbound;
using Assets.Scripts.Utils;
using System;
using Assets.Scripts.Extensions;
using Assets.Scripts.Services;

namespace Assets.Scripts.Scenes.Registration
{
    public class RegistrationSceneController : SceneController
    {
        
        // Configurable script parameters
        public InputField UsernameInputField;
        public InputField PasswordInputField;
        public InputField PasswordConfirmInputField;
        public InputField EmailInputField;
        public Text ErrorLabel;
        public RegistrationFormValidationController FormValidationController;
        public Button RegisterButton;

        private RegistrationService registrationService;

        void Start()
        {
            registrationService = FindObjectOfType<RegistrationService>();
            registrationService.OnRegistrationSuccess += RegistrationSuccessCallback;
            registrationService.OnRegistrationFailed += RegistrationFailedCallback;
            ErrorLabel.transform.gameObject.SetActive(false);
        }

        void OnDestroy()
        {
            registrationService.OnRegistrationSuccess -= RegistrationSuccessCallback;
            registrationService.OnRegistrationFailed -= RegistrationFailedCallback;
        }

        public void OnExitButtonClick()
        {
            LoadScene(Scenes.Scene.TITLE_SCENE);
        }

        public void OnRegisterButtonClick()
        {
            Register();
        }

        private void Register()
        {
            RegisterButton.interactable = false;
            registrationService.Register(UsernameInputField.text, PasswordInputField.text, EmailInputField.text);
        }

        private void RegistrationFailedCallback(WWW request)
        {
            RegisterButton.interactable = true;
            if (request.GetStatusCode() == HttpStatusCode.Unauthorized)
            {
                ErrorLabel.text = "Username or email already exists";
            }
            else
            {
                ErrorLabel.text = request.error;
            }
            ErrorLabel.transform.gameObject.SetActive(true);
        }

        private void RegistrationSuccessCallback()
        {
            RegisterButton.interactable = true;
            LoadScene(Scenes.Scene.LOGIN_SCENE);
        }
    }
}