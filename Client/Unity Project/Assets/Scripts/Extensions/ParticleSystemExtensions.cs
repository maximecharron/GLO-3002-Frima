using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

public static class ParticleSystemExtensions
{
    public static void PlayEnable(this ParticleSystem particleSystem)
    {
        particleSystem.Simulate(0.0f, true, true);
        var emission = particleSystem.emission;
        emission.enabled = true;
        particleSystem.Play();
    }
}
