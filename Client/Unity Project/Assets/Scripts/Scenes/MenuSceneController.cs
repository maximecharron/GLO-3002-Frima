using UnityEngine;
using UnityEngine.EventSystems;
using System.Collections;
using UnityEngine.SceneManagement;

namespace Assets.Scripts
{
    public class MenuSceneController : SceneController
    {

        // Configurable script parameters
        public EventSystem eventSystem;
        public GameObject newGameButton;
        public GameObject joinGameButton;

        // Use this for initialization
        void Start() {

        }

        // Update is called once per frame
        void Update() {
            if (eventSystem.currentSelectedGameObject == newGameButton) {
                // TODO
            }
            if (eventSystem.currentSelectedGameObject == joinGameButton) {
                // TODO
            }
        }
    }
}