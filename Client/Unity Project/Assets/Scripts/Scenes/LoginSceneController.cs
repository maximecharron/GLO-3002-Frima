using UnityEngine;
using UnityEngine.EventSystems;
using System.Collections;
using UnityEngine.SceneManagement;

namespace Assets.Scripts {

    public class LoginSceneController : SceneController {

        // Configurable script parameters
        public EventSystem eventSystem;
        public GameObject loginButton;

        // Use this for initialization
        void Start() {
            
        }

        // Update is called once per frame
        void Update() {
            if (eventSystem.currentSelectedGameObject == loginButton)
            {
                // TODO
            }
        }
    }
}