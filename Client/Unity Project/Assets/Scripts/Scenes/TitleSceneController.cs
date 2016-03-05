using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;

namespace Assets.Scripts.Scenes
{

    public class TitleSceneController : SceneController {

        public EventSystem eventSystem;

        void Start() {

        }

        void Update() {

        }

        public void OnLoginButtonPointerClick()
        {
            SceneManager.LoadScene(LOGIN_SCENE_NAME);
        }

        public void OnRegisterButtonPointerClick()
        {
            SceneManager.LoadScene(REGISTRATION_SCENE_NAME);
        }


    }
}