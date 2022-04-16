using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace cookiesid.Pages
{
    [Authorize]
    public class PrivateModel : PageModel
    {
        public void OnGet()
        {
        }
    }
}
