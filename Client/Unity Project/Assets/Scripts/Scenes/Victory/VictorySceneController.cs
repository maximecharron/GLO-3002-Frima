using UnityEngine;
using System.Collections;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using UnityEngine.UI;
using Assets.Scripts.Scenes.Game;
using System;
using Assets.Scripts.Services;

namespace Assets.Scripts.Scenes
{
    public class VictorySceneController : SceneController
    {
        public Text VictoryTimeText;

        public void Start()
        {
            GameStatisticsService gameStatisticsService = FindObjectOfType<GameStatisticsService>();
            VictoryTimeText.text = String.Format("BOSS KILLED IN {0:0.} MINUTES!", gameStatisticsService.BossLifeSpan.TotalMinutes);
        }

        public void OnPlayAgainButtonClick()
        {
            LoadScene(Scenes.Scene.GAME_SCENE);
        }

        public void OnMenuButtonClick()
        {
            LoadScene(Scenes.Scene.MENU_SCENE);
        }
    }
}
