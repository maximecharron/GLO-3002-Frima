using UnityEngine;
using UnityEngine.EventSystems;
using System.Collections;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using Assets.Scripts.Communication;
using System.Net;
using Assets.Scripts.Communication.DTOs;

namespace Assets.Scripts
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
        public Text usernameErrorLabel;
        public Text passwordErrorLabel;
        public Text passwordConfirmErrorLabel;
        public Text emailErrorLabel;
        public Text registrationErrorLabel;
        public Button registerButton;

        //Private attributes
        private Application application;
        private CommunicationService communicationService;

        // Use this for initialization
        void Start()
        {
            application = (Application)FindObjectOfType(typeof(Application));
            communicationService = (CommunicationService)FindObjectOfType(typeof(CommunicationService));
            resetErrorLabels();
        }

        private void resetErrorLabels()
        {
            usernameErrorLabel.transform.gameObject.SetActive(false);
            passwordErrorLabel.transform.gameObject.SetActive(false);
            passwordConfirmErrorLabel.transform.gameObject.SetActive(false);
            emailErrorLabel.transform.gameObject.SetActive(false);
            registrationErrorLabel.transform.gameObject.SetActive(false);
        }

        // Update is called once per frame
        void Update() {

        }

        public void OnRegisterButtonPointerClick()
        {
            Register();
        }

        private void Register()
        {
            if (ValidateForm())
            {
                WWWForm form = new WWWForm();
                form.AddField("username", usernameInputField.text);
                form.AddField("password", passwordInputField.text);
                form.AddField("email", emailInputField.text);

                communicationService.HttpPost(REGISTRATION_URL, form, RegisterCallback);
                registerButton.interactable = false;
            }
        }

        private bool ValidateForm()
        {
            resetErrorLabels();
            if (passwordInputField.text != passwordConfirmInputField.text)
            {
                passwordConfirmErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            else if (passwordInputField.text.Length <= 3)
            {
                passwordErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            return true;
        }

        private void RegisterCallback(WWW request)
        {
            registerButton.interactable = true;
            if (request.GetStatusCode() != HttpStatusCode.OK)
            {
                registrationErrorLabel.transform.gameObject.SetActive(true);
                return;
            }
            RegistrationResultDTO resultDTO = JsonUtility.FromJson<RegistrationResultDTO>(request.text);
            application.SetUserSession(resultDTO.token, resultDTO.name);
            SceneManager.LoadScene(TITLE_SCENE_NAME);
        }
    }
}