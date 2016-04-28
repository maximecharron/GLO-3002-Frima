using UnityEngine;

namespace Assets.Scripts.Controls
{
    [RequireComponent(typeof(AudioSource))]
    class Button : MonoBehaviour
    {
        public void OnClick()
        {
            AudioSource audioSource = GetComponent<AudioSource>();
            audioSource.Play();
        }
    }
}
