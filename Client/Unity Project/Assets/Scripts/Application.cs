using UnityEngine;
using Assets.Scripts.Communication;

namespace Assets.Scripts
{

#pragma warning disable CS0618

    [RequireComponent(typeof(AudioSource))]
    public class Application: MonoBehaviour
    {
        public HttpService httpService;

        public string sessionToken { get; set; }

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

        void Start()
        {
            
        }

        void Update()
        {

        }

        public void SetUserSession(string token, string username)
        {
            this.sessionToken = token;
            httpService.sessionToken = token;
        }

        public void ClearUserSession()
        {
            this.sessionToken = null;
            httpService.sessionToken = null;
        }
    }
}