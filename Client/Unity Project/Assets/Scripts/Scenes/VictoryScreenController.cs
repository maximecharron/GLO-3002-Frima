using UnityEngine;
using System.Collections;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;


namespace Assets.Scripts
{
    public class VictoryScreenController : SceneController
    {

        public EventSystem eventSystem;
        public GameObject PlayAgainButton;
        public GameObject MenuButton;

        // Use this for initialization
        void Start(){

        }

        // Update is called once per frame
        void Update(){
            if (eventSystem.currentSelectedGameObject == PlayAgainButton){
                SceneManager.LoadScene(GAME_SCENE_NAME);
            }
            if (eventSystem.currentSelectedGameObject == MenuButton) {
                SceneManager.LoadScene(MENU_SCENE_NAME);
            }
        }
    }
}
