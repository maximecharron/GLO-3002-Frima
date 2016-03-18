using UnityEngine;
using System.Collections;
using UnityEngine.UI;
using Assets.Scripts.Utils;

namespace Assets.Scripts.Scenes.Registration
{
    public class RegistrationFormValidationController : MonoBehaviour
    {

        // Configurable script parameters
        public InputField UsernameInputField;
        public InputField PasswordInputField;
        public InputField PasswordConfirmInputField;
        public InputField EmailInputField;
        public Text UsernameErrorLabel;
        public Text PasswordErrorLabel;
        public Text PasswordConfirmErrorLabel;
        public Text EmailErrorLabel;

        void Start()
        {
            ResetErrorLabels();
        }

        public bool Validate()
        {
            ResetErrorLabels();
            if (UsernameInputField.text.Length <= 3)
            {
                UsernameErrorLabel.text = "Username too short";
                UsernameErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            else if (PasswordInputField.text.Length <= 3)
            {
                PasswordErrorLabel.text = "Password too short";
                PasswordErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            else if (PasswordInputField.text != PasswordConfirmInputField.text)
            {
                PasswordConfirmErrorLabel.text = "Password does not match";
                PasswordConfirmErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            else if (!EmailValidationUtils.IsEmailValid(EmailInputField.text))
            {
                EmailErrorLabel.text = "Invalid email";
                EmailErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            return true;
        }

        private void ResetErrorLabels()
        {
            UsernameErrorLabel.transform.gameObject.SetActive(false);
            PasswordErrorLabel.transform.gameObject.SetActive(false);
            PasswordConfirmErrorLabel.transform.gameObject.SetActive(false);
            EmailErrorLabel.transform.gameObject.SetActive(false);
        }

    }
}