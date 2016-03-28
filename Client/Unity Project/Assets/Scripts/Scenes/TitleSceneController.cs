using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;

namespace Assets.Scripts.Scenes
{

    public class TitleSceneController : SceneController {

        private string bossTimePassed = "";
        private string reward = "";

        public void Start()
        {

        }

        public void OnLoginButtonPointerClick()
        {
            SceneManager.LoadScene(LOGIN_SCENE_NAME);
        }

        public void OnRegisterButtonPointerClick()
        {
            SceneManager.LoadScene(REGISTRATION_SCENE_NAME);
        }

        public void OnExitButtonPointerClick()
        {
            UnityEngine.Application.Quit();
        }

    }
}