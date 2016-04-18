using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;

namespace Assets.Scripts.Scenes
{

    public class TitleSceneController : SceneController {

        public void OnLoginButtonClick()
        {
            LoadScene(Scenes.Scene.LOGIN_SCENE);
        }

        public void OnRegisterButtonClick()
        {
            LoadScene(Scenes.Scene.REGISTRATION_SCENE);
        }

        public void OnExitButtonClick()
        {
            UnityEngine.Application.Quit();
        }

    }
}