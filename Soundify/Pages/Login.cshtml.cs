using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Newtonsoft.Json;
using Soundify.Models;

namespace Soundify.Pages
{
    public class LoginStatus : RequestStatus
    { 
        public int userId { get; set; }
        public string username { get; set; }
    }

    public class LoginModel : PageModel
    {
        DatabaseContext _db;
        public LoginModel(DatabaseContext db) 
        {
            _db = db;
        }


        public JsonResult OnPost([FromForm] Users data)
        {
            Users user = _db.users.Where(user => user.username == data.username && user.password == data.password).FirstOrDefault();
            if (user != null)
            {
                HttpContext.Session.SetInt32("LoggedUserId", user.id);
                HttpContext.Session.SetString("LoggedUsername", user.username);
                return new JsonResult(new LoginStatus { status = true, message = "Login succesful", userId = user.id, username = user.username});
            }

            return new JsonResult(new LoginStatus { status = false, message = "Invallid credentials"});
        }
    }
}
