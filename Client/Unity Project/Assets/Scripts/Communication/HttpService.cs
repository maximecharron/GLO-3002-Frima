using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using Assets.Scripts.Communication.DTOs;
using Assets.Scripts.Extensions;

namespace Assets.Scripts.Communication
{

    public class HttpService : MonoBehaviour
    {
        private const string HTTP_SERVER_URI = "https://frima-server-1.herokuapp.com";

        public String SessionToken { get; set; }

        public void HttpGet(String location, Action<WWW> callback)
        {
            Debug.Log(String.Format("HTTP GET: {0}", location));
            StartCoroutine(HttpGetCoroutine(location, callback));
        }

        private IEnumerator HttpGetCoroutine(String location, Action<WWW> callback)
        {
            WWW request = new WWW(HTTP_SERVER_URI + location);
            yield return request;
            if (callback != null)
                callback(request);
        }

        public void HttpPost(String location, WWWForm form, Action<WWW> callback)
        {
            Debug.Log(String.Format("HTTP POST: {0}", location));
            StartCoroutine(HttpPostCoroutine(location, form, callback));
        }

        private IEnumerator HttpPostCoroutine(String location, WWWForm form, Action<WWW> callback)
        {
            WWW request = new WWW(HTTP_SERVER_URI + location, form);
            yield return request;
            if (callback != null)
                callback(request);
        }
    }
}