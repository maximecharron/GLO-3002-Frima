using UnityEngine;
using System.Collections;
using Assets.Scripts.Scenes.Game;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UI;


namespace Assets.Scripts.Scenes
{
    public class VictoryScreenController : SceneController
    {
        public Text VictoryMessage;
        public Text VictoryTimer;
        private TimerService timerservice;

        public void Start()
        {
            timerservice = FindObjectOfType<TimerService>();
            VictoryMessage.text = "";
            VictoryTimer.text = "Took "+timerservice.calculateTimeAlive()+ " minutes to defeat the boss";
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
