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
        public const float BOSS_RELATIVE_HEIGHT = 0.75f;
        public const float BOSS_POSITION_FROM_BOTTOM = 110;

        // Configurable script parameters
        public WebSocketService WebSocketService;
        public BossController BossController;
        public GameObject Boss;
        public GameObject LoadingSceneOverlay;
        public Canvas Canvas;

        void Start() {
            GameController gameController = FindObjectOfType<GameController>();
            WebSocketService.SessionToken = gameController.SessionToken;
            BossController.OnBossDead += OnBossDead;
            AdjustBossPositioning();
            InitCommunication();
        }

        private void AdjustBossPositioning()
        {
            float verticalScale = Canvas.GetComponent<RectTransform>().rect.height * BOSS_RELATIVE_HEIGHT;
            Boss.transform.localScale = new Vector3(verticalScale, verticalScale, 1);
            float canvasHeight = Canvas.GetComponent<RectTransform>().rect.height;
            Boss.transform.localPosition = new Vector3(Boss.transform.localPosition.x, BOSS_POSITION_FROM_BOTTOM - (canvasHeight - verticalScale) / 2, Boss.transform.localPosition.z);
        }

        private void InitCommunication()
        {
            WebSocketService.OnInitializationComplete = OnCommunicationInitializationComplete;
            WebSocketService.Init();
        }

        private void OnCommunicationInitializationComplete()
        {
            LoadingSceneOverlay.gameObject.SetActive(false);
        }

        public void OnExitButtonPointerClick()
        {
            SceneManager.LoadScene(MENU_SCENE_NAME);
        }

        private void OnBossDead()
        {
            SceneManager.LoadScene(VICTORY_SCENE_NAME);
        }

    }
}