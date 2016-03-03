using UnityEngine;
using System;

namespace Assets.Scripts
{

    public class CommunicationService : MonoBehaviour
    {

        private const string SERVER_ADDRESS = "wss://frima-server-1.herokuapp.com";

        private WebSocket webSocket;

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
            string data = webSocket.RecvString();
            // TODO: Dispatch command appropriately
        }

        private void KeepConnectionAlive()
        {
            webSocket.SendString("Poke");
        }
    }
}