using Assets.Scripts.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Extensions
{
    public static class RectTransformExtensions
    {
        public static Rect GetWorldRect(this RectTransform rectTransofrm)
        {
            Vector3[] corners = new Vector3[4];
            rectTransofrm.GetWorldCorners(corners);
            return RectUtils.RectFromCorners(corners);
        }
    }
}