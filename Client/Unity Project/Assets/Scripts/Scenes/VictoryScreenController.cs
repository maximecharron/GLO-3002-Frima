using UnityEngine;
using System.Collections;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UI;


namespace Assets.Scripts.Scenes
{
    public class VictoryScreenController : SceneController
    {
        public Text VictoryMessage;
        public Text VictoryTimer;

        public void Start()
        {
            VictoryMessage.text = "";
            VictoryTimer.text = "";
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
