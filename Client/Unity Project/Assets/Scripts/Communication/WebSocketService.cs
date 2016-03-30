using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using Assets.Scripts.Communication.CommandDTOs;
using Assets.Scripts.Extensions;

namespace Assets.Scripts.Communication
{

    public class WebSocketService : MonoBehaviour
    {
        private const string WEB_SOCKET_SERVER_URI = "wss://frima-server-1.herokuapp.com";

        public String SessionToken { get; set; }
        public Action OnInitializationComplete { get; set; }

        private bool initialized = false;
        private WebSocket webSocket;
        private Dictionary<String, CommandRegistration> registeredCommands = new Dictionary<string, CommandRegistration>();
        private Dictionary<Type, ICommandInterceptor> commandReceiveInterceptors = new Dictionary<Type, ICommandInterceptor>();
        private Dictionary<Type, ICommandInterceptor> commandSendInterceptors = new Dictionary<Type, ICommandInterceptor>();

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
                CompleteInitialization();
            }
        }

        private void CompleteInitialization()
        {
            if (!initialized)
            {
                initialized = true;
                if (OnInitializationComplete != null)
                {
                    OnInitializationComplete();
                }
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
            CommandDTO commandDTO = (CommandDTO)JsonUtility.FromJson(jsonData, commandRegistration.Type);
            if (!DispatchReceiveCommandToInterceptors(commandDTO))
            {
                return;
            }
            commandRegistration.CallbackMethod(commandDTO);
        }

        private bool DispatchReceiveCommandToInterceptors(CommandDTO commandDTO)
        {
            if (commandReceiveInterceptors.ContainsKey(commandDTO.GetType()))
            {
                return commandReceiveInterceptors[commandDTO.GetType()].ReceiveIntercept(commandDTO);
            }
            return true;
        }

        public void RegisterCommand(String commandName, Action<CommandDTO> callbackMethod, Type dtoType)
        {
            registeredCommands.AddOrReplace(commandName, new CommandRegistration(callbackMethod, dtoType));
        }

        public void UnregisterCommand(String commandName)
        {
            registeredCommands.Remove(commandName);
        }

        public void SendCommand(CommandDTO commandDTO, bool interceptable = true)
        {
            if (interceptable && !DispatchSendCommandToInterceptors(commandDTO))
            {
                return;
            }
            commandDTO.token = SessionToken;
            String jsonData = JsonUtility.ToJson(commandDTO, true);
            webSocket.SendString(jsonData);
        }

        private bool DispatchSendCommandToInterceptors(CommandDTO commandDTO)
        {
            if (commandSendInterceptors.ContainsKey(commandDTO.GetType()))
            {
                return commandSendInterceptors[commandDTO.GetType()].SendIntercept(commandDTO);
            }
            return true;
        }

        private void KeepConnectionAlive()
        {
            SendCommand(new KeepAliveCommandDTO());
        }

        public void AddSendInterceptor(ICommandInterceptor interceptor, Type commandType)
        {
            this.commandSendInterceptors.Add(commandType, interceptor);
        }

        public void AddReceiveInterceptor(ICommandInterceptor interceptor, Type commandType)
        {
            this.commandReceiveInterceptors.Add(commandType, interceptor);
        }

    }
}