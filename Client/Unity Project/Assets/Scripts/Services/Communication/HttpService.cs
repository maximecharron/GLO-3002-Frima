using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using Assets.Scripts.Services.Communication.DTOs;
using Assets.Scripts.Extensions;

namespace Assets.Scripts.Services.Communication
{
    public class HttpService : MonoSingleton
    {
        private const string HTTP_SERVER_URI = "https://frima-server-1.herokuapp.com";

        public string SessionToken { get; set; }

        public void HttpGet(string location, Action<WWW> callback)
        {
            Debug.Log(String.Format("HTTP GET: {0}", location));
            StartCoroutine(HttpGetCoroutine(location, callback));
        }

        private IEnumerator HttpGetCoroutine(string location, Action<WWW> callback)
        {
            WWW request = new WWW(HTTP_SERVER_URI + location);
            yield return request;
            Debug.Log(String.Format("HTTP GET Result: {0}", request.text));
            if (callback != null)
                callback(request);
        }

        public void HttpPost(string location, WWWForm form, Action<WWW> callback)
        {
            Debug.Log(String.Format("HTTP POST: {0}", location));
            StartCoroutine(HttpPostCoroutine(location, form, callback));
        }

        private IEnumerator HttpPostCoroutine(string location, WWWForm form, Action<WWW> callback)
        {
            WWW request = new WWW(HTTP_SERVER_URI + location, form);
            yield return request;
            Debug.Log(String.Format("HTTP POST Result: {0}", request.text));
            if (callback != null)
                callback(request);
        }
    }
}