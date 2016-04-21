using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
