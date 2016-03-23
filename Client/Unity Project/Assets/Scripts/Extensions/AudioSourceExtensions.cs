﻿using UnityEngine;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Assets.Scripts.Extensions
{
    static class AudioSourceExtensions
    {
        public static void PlayAudioClip(this AudioSource audioSource, AudioClip audioClip, bool loop = false, float volume = 1f)
        {
            if (audioClip != null)
            {
                audioSource.clip = audioClip;
                audioSource.loop = loop;
                audioSource.volume = volume;
                audioSource.Play();
            }
        }
    }
}