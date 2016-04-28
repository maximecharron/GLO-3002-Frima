using Assets.Scripts.Utils;
using UnityEngine;
using UnityEngine.UI;

namespace Assets.Scripts.Scenes.Registration
{
    public class RegistrationFormValidationController : MonoBehaviour
    {

        // Configurable script parameters
        public InputField UsernameInputField;
        public InputField PasswordInputField;
        public InputField PasswordConfirmInputField;
        public InputField EmailInputField;
        public Text ErrorLabel;

        void Start()
        {
            ResetErrorLabels();
        }

        public bool Validate()
        {
            ResetErrorLabels();
            if (!ValidateUsername() || !ValidatePassword() || !ValidateEmail())
            {
                ErrorLabel.gameObject.SetActive(true);
                return false;
            }
            return true;
        }

        private bool ValidateUsername()
        {
            if (UsernameInputField.text.Length <= 3)
            {
                ErrorLabel.text = "Username too short";
                return false;
            }
            return true;
        }

        private bool ValidatePassword()
        {
            if (PasswordInputField.text.Length <= 3)
            {
                ErrorLabel.text = "Password too short";
                return false;
            }
            else if (PasswordInputField.text != PasswordConfirmInputField.text)
            {
                ErrorLabel.text = "Password does not match";
                return false;
            }
            return true;
        }

        private bool ValidateEmail()
        {
            return EmailValidationUtils.IsEmailValid(EmailInputField.text);
        }

        private void ResetErrorLabels()
        {
            ErrorLabel.transform.gameObject.SetActive(false);
        }

    }
}