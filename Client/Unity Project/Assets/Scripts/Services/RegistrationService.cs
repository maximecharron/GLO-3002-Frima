using Assets.Scripts.Extensions;
using Assets.Scripts.Services.Communication;
using Assets.Scripts.Services.Communication.DTOs.Inbound;
using System.Net;
using UnityEngine;

namespace Assets.Scripts.Services
{
    class RegistrationService : MonoSingleton
    {
        private const string REGISTRATION_URL = "/signup";

        public delegate void RegistrationSuccessEventHandler();
        public event RegistrationSuccessEventHandler OnRegistrationSuccess = delegate { };
        public delegate void RegistrationFailedEventHandler(WWW request);
        public event RegistrationFailedEventHandler OnRegistrationFailed = delegate { };

        private HttpService httpService;

        void Start()
        {
            httpService = FindObjectOfType<HttpService>();
        }

        public void Register(string username, string password, string email)
        {
            WWWForm form = new WWWForm();
            form.AddField("username", username);
            form.AddField("password", password);
            form.AddField("email", email);

            httpService.HttpPost(REGISTRATION_URL, form, RegistrationCallback);
        }

        private void RegistrationCallback(WWW request)
        {
            if (request.GetStatusCode() == HttpStatusCode.OK || request.GetStatusCode() == 0)
            {
                RegistrationResultDTO resultDTO = JsonUtility.FromJson<RegistrationResultDTO>(request.text);
                if (resultDTO != null) {
                    OnRegistrationSuccess();
                }
            }
            OnRegistrationFailed(request);
        }
    }
}
