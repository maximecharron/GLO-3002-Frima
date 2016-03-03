using UnityEngine;
using UnityEngine.EventSystems;
using System.Collections;
using UnityEngine.SceneManagement;

namespace Assets.Scripts
{

    public class GameSceneController : SceneController
    {

        // Configurable script parameters
        public EventSystem eventSystem;
        public GameObject exitButton;


        // Use this for initialization
        void Start() {

        }

        // Update is called once per frame
        void Update() {
            if (eventSystem.currentSelectedGameObject == exitButton) {
                SceneManager.LoadScene(MENU_SCENE_NAME);
            }
        }
    }
}