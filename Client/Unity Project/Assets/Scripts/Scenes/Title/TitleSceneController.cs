using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;

namespace Assets.Scripts.Scenes
{

    public class TitleSceneController : SceneController {

        public void OnLoginButtonPointerClick()
        {
            LoadScene(Scenes.Scene.LOGIN_SCENE);
        }

        public void OnRegisterButtonPointerClick()
        {
            LoadScene(Scenes.Scene.REGISTRATION_SCENE);
        }

        public void OnExitButtonPointerClick()
        {
            UnityEngine.Application.Quit();
        }

    }
}