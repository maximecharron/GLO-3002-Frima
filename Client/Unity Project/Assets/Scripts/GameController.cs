using UnityEngine;
using System.Collections;

namespace Assets.Scripts
{
    [RequireComponent(typeof(AudioSource))]
    public class GameMonitor: MonoBehaviour
    {
        //Configurable script parameters
        public CommunicationService communicationService;

        //Privates
        private AudioSource audioSource;

        private GameController gameController;

        void Awake()
        {
            // Make this object persist through scenes
            DontDestroyOnLoad(this.gameObject);
            this.gameController = new GameController();
        }

        // Use this for initialization
        void Start()
        {
            int value = this.gameController.start();
        }

        // Update is called once per frame
        void Update()
        {

        }
    }

    #region behavior

    [System.Serializable]
    public class GameController
    {
        public int start()
        {
            return 1;
        }
    }
    #endregion
}