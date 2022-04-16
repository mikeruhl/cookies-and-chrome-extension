using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace cookiesid.Controllers
{
    [Route("api/me")]
    [Authorize]
    [ApiController]
    public class UserController:ControllerBase
    {
        private readonly SignInManager<IdentityUser> _manager;

        public UserController(SignInManager<IdentityUser> manager)
        {
            _manager = manager;
        }
        [HttpGet()]
        public IActionResult GetMyself()
        {
            return Ok(new { Name = HttpContext.User.Identity?.Name ?? "unknown" });
        }

        [HttpPost("signout")]
        public async Task<IActionResult> SignOutMyself()
        {
            await _manager.SignOutAsync();
            return Ok();
        }

       
    }
}
