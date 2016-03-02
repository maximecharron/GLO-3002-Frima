using UnityEngine;
using System.Collections;

namespace Assets.Scripts
{
    [RequireComponent(typeof(AudioSource))]
    public class GameController : MonoBehaviour
    {
        //Configurable script parameters
        public CommunicationService communicationService;

        //Privates
        private AudioSource audioSource;

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