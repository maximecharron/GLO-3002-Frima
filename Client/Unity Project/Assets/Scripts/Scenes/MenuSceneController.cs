using UnityEngine;
using UnityEngine.EventSystems;
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
                SceneManager.LoadScene(GAME_SCENE_NAME);
            }
            if (eventSystem.currentSelectedGameObject == joinGameButton) {
                SceneManager.LoadScene(GAME_SCENE_NAME);
            }
        }
    }
}