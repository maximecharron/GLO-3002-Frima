﻿using UnityEngine;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Reflection;
using Assets.Scripts.Communication.CommandDTOs;

namespace Assets.Scripts.Communication
{

    public class HttpService : MonoBehaviour
    {
        private const string HTTP_SERVER_URI = "http://frima-server-1.herokuapp.com";

        public String sessionToken { get; set; }

        void Start()
        {
            
        }

        void Update()
        {

        }

        public void HttpGet(String location, Action<WWW> callback)
        {
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