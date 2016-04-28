using UnityEngine;
using UnityEngine.SceneManagement;

namespace Assets.Scripts.Scenes
{
    public class SceneController : MonoBehaviour
    {

        protected void LoadScene(Scene scene)
        {
            SceneManager.LoadScene((int)scene);
        }
    }
}