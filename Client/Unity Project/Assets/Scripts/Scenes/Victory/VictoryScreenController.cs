using UnityEngine;
using System.Collections;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using Assets.Scripts.Scenes.Game;
using System;

namespace Assets.Scripts.Scenes
{
    public class VictoryScreenController : SceneController
    {
        public Text VictoryTimeText;

        public void Start()
        {
            GameStatisticsController gameStatisticsController = FindObjectOfType<GameStatisticsController>();
            VictoryTimeText.text = String.Format("Boss killed in {0:0.} minutes!", gameStatisticsController.BossLifeSpan.TotalMinutes);
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
