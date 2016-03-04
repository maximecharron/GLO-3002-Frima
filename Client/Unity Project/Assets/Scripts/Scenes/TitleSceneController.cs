using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;

namespace Assets.Scripts.Scenes
{

    public class TitleSceneController : SceneController {

        // Configurable script parameters
        public EventSystem eventSystem;

        // Use this for initialization
        void Start() {

        }

        // Update is called once per frame
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