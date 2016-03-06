﻿using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using Assets.Scripts.Communication.CommandDTOs;

namespace Assets.Scripts.Communication
{

    public class WebSocketService : MonoBehaviour
    {
        private const string WEB_SOCKET_SERVER_URI = "wss://frima-server-1.herokuapp.com";

        public String sessionToken { get; set; }

        private WebSocket webSocket;
        private Dictionary<String, CommandRegistration> registeredCommands = new Dictionary<string, CommandRegistration>();

        void Start()
        {
            
        }

        void Update()
        {
            ReceiveCommands();
        }

        public void OnDestroy()
        {
            webSocket.Close();
        }

        public void Init()
        {
            webSocket = new WebSocket(new Uri(WEB_SOCKET_SERVER_URI));
            StartCoroutine(webSocket.Connect());
            String jsonData = webSocket.RecvString();
            InvokeRepeating("KeepConnectionAlive", 1f, 30f);
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
                Debug.LogWarning(String.Format("Received a command that is not currently registered: {0}.", commandDefinitionDTO.command.name));
                return;
            }
            CommandRegistration commandRegistration = registeredCommands[commandDefinitionDTO.command.name];
            CommandDTO commandDTO = (CommandDTO)JsonUtility.FromJson(jsonData, commandRegistration.type);
            commandRegistration.callbackMethod(commandDTO);
        }

        public void RegisterCommand(String commandName, Action<CommandDTO> callbackMethod, Type dtoType)
        {
            registeredCommands.AddOrReplace(commandName, new CommandRegistration(callbackMethod, dtoType));
        }

        public void UnregisterCommand(String commandName)
        {
            registeredCommands.Remove(commandName);
        }

        public void SendCommand(CommandDTO commandDTO)
        {
            commandDTO.token = sessionToken;
            String jsonData = JsonUtility.ToJson(commandDTO, true);
            webSocket.SendString(jsonData);
        }

        private void KeepConnectionAlive()
        {
            SendCommand(new KeepAliveCommandDTO());
        }

        
    }
}