using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Net;

namespace cookiesid.Helpers
{
    internal class RedirectHelper
    {
        internal static Func<RedirectContext<CookieAuthenticationOptions>, Task> ReplaceRedirector(HttpStatusCode statusCode, Func<RedirectContext<CookieAuthenticationOptions>, Task> existingRedirector) =>
    context => {
        if (context.Request.Path.StartsWithSegments("/api"))
        {
            context.Response.StatusCode = (int)statusCode;
            return Task.CompletedTask;
        }
        return existingRedirector(context);
    };
    }
}
