using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using Assets.Scripts.Communication.CommandDTOs;

namespace Assets.Scripts.Communication
{

    public class CommunicationService : MonoBehaviour
    {
        private const string WEB_SOCKET_SERVER_URI = "wss://frima-server-1.herokuapp.com";
        private const string REST_SOCKET_SERVER_URI = "http://frima-server-1.herokuapp.com";

        public String token { get; set; }

        private WebSocket webSocket;
        private Dictionary<String, CommandRegistration> registeredCommands = new Dictionary<string, CommandRegistration>();

        // Use this for initialization
        void Start()
        {
            webSocket = new WebSocket(new Uri(WEB_SOCKET_SERVER_URI));
            StartCoroutine(webSocket.Connect());
            InvokeRepeating("KeepConnectionAlive", 1f, 30f);
        }

        // Update is called once per frame
        void Update()
        {
            ReceiveCommands();
        }

        private void ReceiveCommands()
        {
            String jsonData = webSocket.RecvString();
            if (jsonData != null)
            {
                CommandDefinitionDTO commandDefinitionDTO = JsonUtility.FromJson<CommandDefinitionDTO>(jsonData);
                DispatchCommand(commandDefinitionDTO, jsonData);
            }
        }

        private void DispatchCommand(CommandDefinitionDTO commandDefinitionDTO, String jsonData)
        {
            if (!registeredCommands.ContainsKey(commandDefinitionDTO.command.name))
            {
                Debug.LogWarning(String.Format("Received command that is not currently registered: {0}.", commandDefinitionDTO.command.name));
                return;
            }
            CommandRegistration commandRegistration = registeredCommands[commandDefinitionDTO.command.name];
            CommandDTO commandDTO = (CommandDTO)JsonUtility.FromJson(jsonData, commandRegistration.type);
            commandRegistration.callbackMethod(commandDTO);
        }

        public void RegisterCommand(String commandName, Action<CommandDTO> callbackMethod, Type dtoType)
        {
            registeredCommands.Add(commandName, new CommandRegistration(callbackMethod, dtoType));
        }

        public void SendCommand(CommandDTO commandDTO)
        {
            commandDTO.token = token;
            String jsonData = JsonUtility.ToJson(commandDTO, true);
            webSocket.SendString(jsonData);
        }

        private void KeepConnectionAlive()
        {
            SendCommand(new KeepAliveCommandDTO());
        }

        public void HttpGet(String location, Action<WWW> callback)
        {
            StartCoroutine(HttpGetCoroutine(location, callback));
        }

        private IEnumerator HttpGetCoroutine(String location, Action<WWW> callback)
        {
            WWW request = new WWW(REST_SOCKET_SERVER_URI + location);
            yield return request;
            if (callback != null)
                callback(request);
        }

        public void HttpPost(String location, WWWForm form, Action<WWW> callback)
        {
            StartCoroutine(HttpPostCoroutine(location, form, callback));
        }

        private IEnumerator HttpPostCoroutine(String location, WWWForm form, Action<WWW> callback)
        {
            WWW request = new WWW(REST_SOCKET_SERVER_URI + location, form);
            yield return request;
            if (callback != null)
                callback(request);
        }
    }
}