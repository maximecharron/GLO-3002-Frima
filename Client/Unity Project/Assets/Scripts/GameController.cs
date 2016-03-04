﻿using UnityEngine;

namespace Assets.Scripts
{
    [RequireComponent(typeof(AudioSource))]
    public class GameController: MonoBehaviour
    {
        //Configurable script parameters
        public CommunicationService communicationService;

        void Awake()
        {
            // Make this object persist through scenes
            DontDestroyOnLoad(this.gameObject);
        }

        // Use this for initialization
        void Start()
        {

        }

        // Update is called once per frame
        void Update()
        {

        }
    }
}