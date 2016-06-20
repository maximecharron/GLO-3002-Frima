using Assets.Scripts.Extensions;
using Assets.Scripts.Services;
using System.Net;
using UnityEngine;
using UnityEngine.UI;

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
            OnInputFieldValueChanged();
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
            if (FormValidationController.Validate())
            {
                Register();
            }
        }

        private void Register()
        {
            RegisterButton.interactable = false;
            registrationService.Register(UsernameInputField.text, PasswordInputField.text, EmailInputField.text);
        }

        public void OnInputFieldValueChanged()
        {
            RegisterButton.interactable = UsernameInputField.text.Length > 0 
                && PasswordInputField.text.Length > 0 && PasswordConfirmInputField.text.Length > 0 
                && EmailInputField.text.Length > 0;
        }

        private void RegistrationFailedCallback(WWW request)
        {
            RegisterButton.interactable = true;
            if (request.GetStatusCode() == HttpStatusCode.Unauthorized)
            {
                ErrorLabel.text = "Username or email already exists";
            }
            else if (request.error != "")
            {
                ErrorLabel.text = request.error;
            } else
            {
                ErrorLabel.text = "Failed to connect. Please try again later.";
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