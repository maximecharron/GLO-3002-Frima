using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

public static class CameraExtensions
{

    public static Vector2 GetMousePosition(this Camera camera)
    {
        return Camera.main.ScreenToWorldPoint(Input.mousePosition).ToVector2();
    }
}
