using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Soundify.Models;

namespace Soundify.Pages
{
    public class GetPlaylistsModel : PageModel
    {
        DatabaseContext _db;
        public GetPlaylistsModel(DatabaseContext db)
        {
            _db = db;
        }
        public JsonResult OnGet(int user_id)
        {
            return new JsonResult(_db.playlists.Where(p => p.user_id == user_id));
        }
    }
}
