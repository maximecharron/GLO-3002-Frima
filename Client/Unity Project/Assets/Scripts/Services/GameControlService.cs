using UnityEngine;
using Assets.Scripts.Communication;
using Assets.Scripts.Extensions;
using UnityEngine.SceneManagement;

namespace Assets.Scripts.Services
{

#pragma warning disable CS0618

    [RequireComponent(typeof(AudioSource))]
    public class GameControlService : MonoBehaviour
    {
        // Configurable script parameters
        public HttpService HttpService;
        public WebSocketService WebSocketService;

        public bool GlobalAudioThemeEnabled
        {
            get {
                return GetComponent<AudioSource>().enabled;
            }
            set {
                GetComponent<AudioSource>().enabled = value;
            }
        }

        public string SessionToken { get; set; }

        private static GameControlService instance;

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

        public void SetUserSession(string token, string username)
        {
            this.SessionToken = token;
            HttpService.SessionToken = token;
            WebSocketService.SessionToken = token;
        }

        public void ClearUserSession()
        {
            this.SessionToken = null;
            HttpService.SessionToken = null;
        }

    }
}