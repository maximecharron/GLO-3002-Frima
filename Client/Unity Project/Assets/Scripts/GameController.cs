using UnityEngine;
using System.Collections;

namespace Assets.Scripts
{
    public class GameController : MonoBehaviour
    {
        //Configurable script parameters
        public CommunicationService communicationService;

        //Privates

        void Awake()
        {
            DontDestroyOnLoad(transform.gameObject);
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