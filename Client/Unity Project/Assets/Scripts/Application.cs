using UnityEngine;
using Assets.Scripts.Communication;

namespace Assets.Scripts
{

#pragma warning disable CS0618

    [RequireComponent(typeof(AudioSource))]
    public class Application: MonoBehaviour
    {
        // Configurable script parameters
        public CommunicationService communicationService;

        void Awake()
        {
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

        public void SetUserSession(string token, string username)
        {
            communicationService.token = token;
        }
    }
}