using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using Assets.Scripts.Utils;

namespace Assets.Scripts.Scenes.Registration
{
    public class RegistrationFormValidationController : MonoBehaviour
    {

        // Configurable script parameters
        public InputField usernameInputField;
        public InputField passwordInputField;
        public InputField passwordConfirmInputField;
        public InputField emailInputField;
        public Text usernameErrorLabel;
        public Text passwordErrorLabel;
        public Text passwordConfirmErrorLabel;
        public Text emailErrorLabel;

        void Start()
        {
            ResetErrorLabels();
        }

        public bool Validate()
        {
            ResetErrorLabels();
            if (usernameInputField.text.Length <= 3)
            {
                usernameErrorLabel.text = "Username too short";
                usernameErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            else if (passwordInputField.text.Length <= 3)
            {
                passwordErrorLabel.text = "Password too short";
                passwordErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            else if (passwordInputField.text != passwordConfirmInputField.text)
            {
                passwordConfirmErrorLabel.text = "Password does not match";
                passwordConfirmErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            else if (!EmailValidationUtils.IsEmailValid(emailInputField.text))
            {
                emailErrorLabel.text = "Invalid email";
                emailErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            return true;
        }

        private void ResetErrorLabels()
        {
            usernameErrorLabel.transform.gameObject.SetActive(false);
            passwordErrorLabel.transform.gameObject.SetActive(false);
            passwordConfirmErrorLabel.transform.gameObject.SetActive(false);
            emailErrorLabel.transform.gameObject.SetActive(false);
        }

    }
}