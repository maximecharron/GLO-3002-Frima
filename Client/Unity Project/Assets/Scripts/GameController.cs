using UnityEngine;
using Assets.Scripts.Communication;
using Assets.Scripts.Extensions;

namespace Assets.Scripts
{

#pragma warning disable CS0618

    [RequireComponent(typeof(AudioSource))]
    public class GameController : MonoBehaviour
    {
        // Configurable script parameters
        public HttpService HttpService;
        public WebSocketService WebSocketService;
        public AudioClip TitleAudioClip;
        public AudioClip GameAudioClip;

        public bool GameAudioEnabled
        {
            get {
                return GetComponent<AudioSource>().clip == GameAudioClip;
            }
            set {
                GetComponent<AudioSource>().PlayAudioClip(value ? GameAudioClip : TitleAudioClip);
                GetComponent<AudioSource>().volume = value ? 0.8f : 1f;
            }
        }

        public string SessionToken { get; set; }

        private static GameController instance;

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
            GameAudioEnabled = false;
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