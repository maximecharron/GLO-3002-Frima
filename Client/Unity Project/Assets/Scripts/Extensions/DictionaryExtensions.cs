using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

public static class DictionaryExtensions
{
    public static void AddOrReplace<T1, T2>(this Dictionary<T1, T2> dictionary, T1 key, T2 value)
    {
        if (dictionary.ContainsKey(key))
        {
            dictionary[key] = value;
        }
        else
        {
            dictionary.Add(key, value);
        }
    }

    public static string ToFormattatedString<T1, T2>(this Dictionary<T1, T2> dictionary)
    {
        return string.Join(";", dictionary.Select(x => x.Key + "=" + x.Value).ToArray());
    }
}
