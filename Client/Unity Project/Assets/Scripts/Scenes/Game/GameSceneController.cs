using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using Assets.Scripts.Communication;
using Assets.Scripts.Communication.CommandDTOs;

namespace Assets.Scripts.Scenes.Game
{

    public class GameSceneController : SceneController
    {
        public BossController bossController;

        void Start() {
            bossController.OnBossDead += OnBossDead;
        }

        void Update() {

        }

        public void OnExitButtonPointerClick()
        {
            SceneManager.LoadScene(TITLE_SCENE_NAME);
        }

        private void OnBossDead()
        {
            SceneManager.LoadScene(VICTORY_SCENE_NAME);
        }
    }
}