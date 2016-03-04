using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

namespace Assets.Scripts.Scenes.Game
{

    public class GameSceneController : SceneController
    {

        // Configurable script parameters
        public EventSystem eventSystem;
        public GameObject exitButton;
        public Text healthPointValue;

        // Use this for initialization
        void Start() {

        }

        // Update is called once per frame
        void Update() {
            if (eventSystem.currentSelectedGameObject == exitButton) {
                SceneManager.LoadScene(MENU_SCENE_NAME);
            }
            if (healthPointValue.text == "0")
            {
                SceneManager.LoadScene(VICTORY_SCENE_NAME);
            }
        }
    }
}