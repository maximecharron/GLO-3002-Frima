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
        public Text ErrorLabel;

        void Start()
        {
            ResetErrorLabels();
        }

        public bool Validate()
        {
            ResetErrorLabels();
            if (UsernameInputField.text.Length <= 3)
            {
                ErrorLabel.text = "Username too short";
                ErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            else if (PasswordInputField.text.Length <= 3)
            {
                ErrorLabel.text = "Password too short";
                ErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            else if (PasswordInputField.text != PasswordConfirmInputField.text)
            {
                ErrorLabel.text = "Password does not match";
                ErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            else if (!EmailValidationUtils.IsEmailValid(EmailInputField.text))
            {
                ErrorLabel.text = "Invalid email";
                ErrorLabel.transform.gameObject.SetActive(true);
                return false;
            }
            return true;
        }

        private void ResetErrorLabels()
        {
            ErrorLabel.transform.gameObject.SetActive(false);
        }

    }
}