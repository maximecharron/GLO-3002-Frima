using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using UnityEngine;

namespace Assets.Scripts.Services.Communication.DTOs
{
    [Serializable]
    public class RectDTO
    {
        public float x = 0;
        public float y = 0;
        public float width = 0;
        public float height = 0;

        public RectDTO() { }

        public RectDTO(float x, float y, float width, float height)
        {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }

        public Rect ToRect()
        {
            return new Rect(x, y, width, height);
        }
    }
}
