using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;

namespace Assets.Scripts.Scenes
{

    public class LoginSceneController : SceneController {

        // Configurable script parameters
        public EventSystem eventSystem;
        public GameObject loginButton;

        // Use this for initialization
        void Start() {
            
        }

        // Update is called once per frame
        void Update() {
            if (eventSystem.currentSelectedGameObject == loginButton) {
                SceneManager.LoadScene(MENU_SCENE_NAME);
            }
        }
    }
}