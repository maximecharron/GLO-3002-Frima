﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Utils
{
    class AnimationUtils
    {
        public static float ExponentialEaseOut(float ElaspedTime, float Duration)
        {
            return Mathf.Pow((ElaspedTime), 1f / 5f) / Mathf.Pow(Duration, 1f / 5f);
        }

        public static float LinearTween(float ElapsedTime, float Duration)
        {
            return ElapsedTime / Duration;
        }
    }
}
