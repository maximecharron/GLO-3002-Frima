using UnityEngine;
using UnityEngine.EventSystems;
using System.Collections;
using UnityEngine.SceneManagement;

namespace Assets.Scripts {

    public class TitleSceneController : SceneController {

        // Configurable script parameters
        public EventSystem eventSystem;
        public GameObject loginButton;
        public GameObject registerButton;

        // Use this for initialization
        void Start() {

        }

        // Update is called once per frame
        void Update() {
            if (eventSystem.currentSelectedGameObject == loginButton){
                SceneManager.LoadScene(LOGIN_SCENE_NAME);
            }
            if (eventSystem.currentSelectedGameObject == registerButton) {
                SceneManager.LoadScene(REGISTER_SCENE_NAME);
            }
        }
    }
}