using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Soundify.Pages
{
    public class LogoutModel : PageModel
    {
        public JsonResult OnGet()
        {
            HttpContext.Session.SetInt32("LoggedUserId", 0);
            HttpContext.Session.SetString("LoggedUsername", "");
            return new JsonResult("You have logged out");
        }
    }
}
