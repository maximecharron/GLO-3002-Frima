using UnityEngine;
using Assets.Scripts.Communication;

namespace Assets.Scripts
{

#pragma warning disable CS0618

    [RequireComponent(typeof(AudioSource))]
    public class GameController : MonoBehaviour
    {
        public HttpService HttpService;

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
        }

        public void SetUserSession(string token, string username)
        {
            this.SessionToken = token;
            HttpService.SessionToken = token;
        }

        public void ClearUserSession()
        {
            this.SessionToken = null;
            HttpService.SessionToken = null;
        }
    }
}