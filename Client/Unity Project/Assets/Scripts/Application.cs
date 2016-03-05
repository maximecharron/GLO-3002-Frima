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

        // private attributes
        private static Application instance;

        void Awake()
        {
            if (instance == null)
            {
                instance = this;
            }
            else
            {
                Destroy(this.gameObject);
            }
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

        public void ClearUserSession()
        {
            communicationService.token = null;
        }
    }
}