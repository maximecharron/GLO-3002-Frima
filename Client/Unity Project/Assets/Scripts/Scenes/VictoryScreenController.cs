using UnityEngine;
using System.Collections;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;


namespace Assets.Scripts.Scenes
{
    public class VictoryScreenController : SceneController
    {

        void Start(){

        }

        void Update(){

        }

        public void OnPlayAgainButtonPointerClick()
        {
            SceneManager.LoadScene(GAME_SCENE_NAME);
        }

        public void OnMenuButtonPointerClick()
        {
            SceneManager.LoadScene(MENU_SCENE_NAME);
        }
    }
}
