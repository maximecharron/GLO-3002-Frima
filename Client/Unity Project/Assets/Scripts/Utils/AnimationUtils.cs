using UnityEngine;

namespace Assets.Scripts.Utils
{
    class AnimationUtils
    {
        public static float ExponentialEaseOut(float ElaspedTime, float Duration)
        {
            return 1f * (-Mathf.Pow(2f, -10f * ElaspedTime / Duration) + 1f);
        }

        public static float LinearTween(float ElapsedTime, float Duration)
        {
            return ElapsedTime / Duration;
        }
    }
}
