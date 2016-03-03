using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;

namespace Assets.Scripts
{

    public class CommunicationService : MonoBehaviour
    {

        private const string SERVER_ADDRESS = "wss://frima-server-1.herokuapp.com";

        private WebSocket webSocket;
        private Dictionary<String, CommandRegistration> registeredCommands = new Dictionary<string, CommandRegistration>();

        // Use this for initialization
        void Start()
        {
            webSocket = new WebSocket(new Uri(SERVER_ADDRESS));
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
            string jsonData = webSocket.RecvString();
            if (jsonData != null)
            {
                CommandDTO commandDefinitionDTO = JsonUtility.FromJson<CommandDTO>(jsonData);
                DispatchCommand(commandDefinitionDTO, jsonData);
            }
        }

        private void DispatchCommand(CommandDTO commandDefinitionDTO, string jsonData)
        {
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
            jsonData = JsonUtility.ToJson(commandDTO, true);
            webSocket.SendString(jsonData);
        }

        private void KeepConnectionAlive()
        {
            webSocket.SendString("Poke");
        }

    }
}