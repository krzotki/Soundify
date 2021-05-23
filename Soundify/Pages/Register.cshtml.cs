using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Soundify.Models;

namespace Soundify.Pages
{
    public class RegisterModel : PageModel
    {
        private DatabaseContext _db;

        public RegisterModel(DatabaseContext db)
        {
            _db = db;
        }

        public void OnGet()
        {

        }
        public JsonResult OnPost([FromForm] Users data)
        {
            if (data.username == null || data.username.Length < 3)
            {
                return new JsonResult(new RequestStatus { status = false, message = "Username is too short" });
            }

            if (data.password == null || data.password.Length < 6)
            {
                return new JsonResult(new RequestStatus { status = false, message = "Password is too short" });
            }

            Users user = _db.users.Where(user => user.username == data.username).FirstOrDefault();
            if (user == null)
            {
                _db.users.Add(data);
                _db.SaveChanges();
                return new JsonResult(new RequestStatus { status = true, message = "Register succesful, you can now log in"});
            }

            return new JsonResult(new RequestStatus { status = false, message = "User already exists" });
        }
    }
}
