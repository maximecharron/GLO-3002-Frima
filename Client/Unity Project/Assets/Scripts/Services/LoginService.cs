using Assets.Scripts.Communication;
using Assets.Scripts.Communication.DTOs.Inbound;
using Assets.Scripts.Communication.DTOs.Outbound;
using Assets.Scripts.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Services
{
    class LoginService : MonoBehaviour
    {
        private const string LOGIN_URL = "/login";
        private const string LOGOUT_URL = "/logout";

        public delegate void LoginSuccessEventHandler(LoginResultDTO loginResultDTO);
        public event LoginSuccessEventHandler OnLoginSuccess = delegate { };
        public delegate void LoginFailedEventHandler(WWW request);
        public event LoginFailedEventHandler OnLoginFailed = delegate { };
        public delegate void LogoutSuccessEventHandler(WWW request);
        public event LogoutSuccessEventHandler OnLogoutSuccess = delegate { };

        private HttpService httpService;
        private WebSocketService webSocketService;

        void Start()
        {
            httpService = FindObjectOfType<HttpService>();
            webSocketService = FindObjectOfType<WebSocketService>();
        }

        public void Login(string username, string password)
        {
            WWWForm form = new WWWForm();
            form.AddField("username", username);
            form.AddField("password", password);

            httpService.HttpPost(LOGIN_URL, form, LoginCallback);
        }

        private void LoginCallback(WWW request)
        {
            if (request.GetStatusCode() == HttpStatusCode.OK || request.GetStatusCode() == 0)
            {
                LoginResultDTO resultDTO = JsonUtility.FromJson<LoginResultDTO>(request.text);
                ProcessLoginSuccess(request, resultDTO);
            }
            else {
                OnLoginFailed(request);
            }
        }

        private void ProcessLoginSuccess(WWW request, LoginResultDTO loginResultDTO)
        {
            SetSessionToken(loginResultDTO.token);
            OnLoginSuccess(loginResultDTO);
        }

        public void SetSessionToken(string sessionToken)
        {
            httpService.SessionToken = sessionToken;
            webSocketService.SessionToken = sessionToken;
            webSocketService.SendCommand(new ClientRegistrationDTO(sessionToken));
        }

        public void LogOut()
        {
            httpService.HttpGet(LOGOUT_URL, LogOutCallback);
        }

        private void LogOutCallback(WWW request)
        {
            webSocketService.SessionToken = null;
            httpService.SessionToken = null;
            OnLogoutSuccess(request);
        }
    }
}
