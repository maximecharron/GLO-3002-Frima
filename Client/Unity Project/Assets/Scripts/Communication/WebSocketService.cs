using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using Assets.Scripts.Communication.DTOs;
using Assets.Scripts.Communication.DTOs.Outbound;
using Assets.Scripts.Extensions;

namespace Assets.Scripts.Communication
{

    public class WebSocketService : MonoBehaviour
    {
        private const string WEB_SOCKET_SERVER_URI = "wss://frima-server-1.herokuapp.com";

        public string SessionToken { get; set; }

        private WebSocket webSocket;
        private Dictionary<string, List<CommandRegistration>> registeredCommands = new Dictionary<string, List<CommandRegistration>>();
        private Dictionary<Type, ICommandInterceptor> inboundCommandInterceptors = new Dictionary<Type, ICommandInterceptor>();
        private Dictionary<Type, ICommandInterceptor> outboundCommandInterceptors = new Dictionary<Type, ICommandInterceptor>();
        private Queue<String> incomingCommandBuffer = new Queue<String>();

        void Start()
        {
            DontDestroyOnLoad(this);
            webSocket = new WebSocket(new Uri(WEB_SOCKET_SERVER_URI));
            Connect();
        }

        void Update()
        {
            DispatchBufferedCommands();
            ReceiveCommands();
        }

        public void OnDestroy()
        {
            Debug.Log("WebSocket Disconnect");
            webSocket.Close();
            StopAllCoroutines();
        }

        public void Connect()
        {
            Debug.Log("WebSocket Connect");
            StartCoroutine(webSocket.Connect());
            webSocket.RecvString();
            InvokeRepeating("KeepConnectionAlive", 1f, 30f);
        }

        private void ReceiveCommands()
        {
            string jsonData = webSocket.RecvString();
            if (jsonData != null)
            {
                Debug.Log(String.Format("WebSocket Receive: {0}", jsonData));
                if (!DispatchCommand(jsonData))
                {
                    incomingCommandBuffer.Enqueue(jsonData);
                }
            }
        }

        private void DispatchBufferedCommands()
        {
            for (int i = 0; i < incomingCommandBuffer.Count; i++)
            {
                if (DispatchCommand(incomingCommandBuffer.Peek()))
                {
                    incomingCommandBuffer.Dequeue();
                }
            }
        }

        private bool DispatchCommand(string jsonData)
        {
            CommandDefinitionDTO commandDefinitionDTO = JsonUtility.FromJson<CommandDefinitionDTO>(jsonData);
            if (!registeredCommands.ContainsKey(commandDefinitionDTO.command.name))
            {
                return false;
            }
            foreach (CommandRegistration commandRegistration in registeredCommands[commandDefinitionDTO.command.name])
            {
                CommandDTO commandDTO = (CommandDTO)JsonUtility.FromJson(jsonData, commandRegistration.Type);
                if (DispatchIncomingCommandToInterceptors(commandDTO))
                {
                    commandRegistration.CallbackMethod(commandDTO);
                }
            }
            return true;
        }

        private bool DispatchIncomingCommandToInterceptors(CommandDTO commandDTO)
        {
            if (inboundCommandInterceptors.ContainsKey(commandDTO.GetType()))
            {
                return inboundCommandInterceptors[commandDTO.GetType()].InboundIntercept(commandDTO);
            }
            return true;
        }

        public void RegisterCommand(string commandName, Action<CommandDTO> callbackMethod, Type dtoType)
        {
            if (!registeredCommands.ContainsKey(commandName))
            {
                registeredCommands.TryAdd(commandName, new List<CommandRegistration>());
            }
            registeredCommands[commandName].Add(new CommandRegistration(callbackMethod, dtoType));
        }

        public void UnregisterCommand(string commandName, Action<CommandDTO> callbackMethod)
        {
            CommandRegistration commandRegistration = registeredCommands[commandName].Find(reg => reg.CallbackMethod == callbackMethod);
            registeredCommands[commandName].Remove(commandRegistration);
        }

        public void SendCommand(CommandDTO commandDTO, bool interceptable = true)
        {
            if (interceptable && !DispatchOutgoingCommandToInterceptors(commandDTO))
            {
                return;
            }
            commandDTO.token = SessionToken;
            string jsonData = JsonUtility.ToJson(commandDTO, false);
            Debug.Log(String.Format("WebSocket Send: {0}", jsonData));
            webSocket.SendString(jsonData);
        }

        private bool DispatchOutgoingCommandToInterceptors(CommandDTO commandDTO)
        {
            if (outboundCommandInterceptors.ContainsKey(commandDTO.GetType()))
            {
                return outboundCommandInterceptors[commandDTO.GetType()].OutboundIntercept(commandDTO);
            }
            return true;
        }

        private void KeepConnectionAlive()
        {
            SendCommand(new KeepAliveDTO());
        }

        public void AddOutboundInterceptor(ICommandInterceptor interceptor, Type commandType)
        {
            this.outboundCommandInterceptors.AddOrReplace(commandType, interceptor);
        }

        public void AddInboundInterceptor(ICommandInterceptor interceptor, Type commandType)
        {
            this.inboundCommandInterceptors.AddOrReplace(commandType, interceptor);
        }

    }
}