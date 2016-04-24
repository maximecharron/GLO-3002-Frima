using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Utils
{
    public static class RectUtils
    {
        public static Rect RectFromCorners(Vector3[] corners)
        {
            return new Rect(corners[0].x, corners[0].y, corners[2].x - corners[1].x, corners[1].y - corners[0].y);
        }

    }
}
