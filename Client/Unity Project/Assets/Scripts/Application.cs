using UnityEngine;
using Assets.Scripts.Communication;

namespace Assets.Scripts
{

#pragma warning disable CS0618

    [RequireComponent(typeof(AudioSource))]
    public class Application: MonoBehaviour
    {
        private CommunicationService communicationService;

        private static Application instance;

        void Awake()
        {
            if (instance == null)
            {
                instance = this;
            } else
            {
                Destroy(this.gameObject);
            }
            DontDestroyOnLoad(this.gameObject);
        }

        // Use this for initialization
        void Start()
        {
            communicationService = new CommunicationService();
        }

        // Update is called once per frame
        void Update()
        {

        }
    }
}