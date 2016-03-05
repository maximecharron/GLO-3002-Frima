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
        public Text healthPointValue;

        // Use this for initialization
        void Start() {

        }

        // Update is called once per frame
        void Update() {
            if (healthPointValue.text == "0")
            {
                SceneManager.LoadScene(VICTORY_SCENE_NAME);
            }
        }

        public void OnExitButtonPointerClick()
        {
            SceneManager.LoadScene(TITLE_SCENE_NAME);
        }
    }
}