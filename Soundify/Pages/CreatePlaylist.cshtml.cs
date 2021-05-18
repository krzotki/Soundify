using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Soundify.Models;

namespace Soundify.Pages
{
    public class CreatePlaylistStatus
    {
        public string message { get; set; }
        public bool status { get; set; }

        public int id { get; set; }
        public string name { get; set; }
    }


    public class CreatePlaylistModel : PageModel
    {

        private DatabaseContext _db;

        public CreatePlaylistModel(DatabaseContext db)
        {
            _db = db;
        }
        public JsonResult OnPost([FromForm] Playlists newPlaylist)
        {
            int loggedUserId;
            int.TryParse(HttpContext.Session.GetInt32("LoggedUserId").ToString(), out loggedUserId);

            if (loggedUserId == 0) {
                return new JsonResult(new CreatePlaylistStatus { status = false, message = "Please login" });
            }

            newPlaylist.user_id = loggedUserId;

            _db.playlists.Add(newPlaylist);

            if (_db.SaveChanges() > 0)
            {
                return new JsonResult(new CreatePlaylistStatus { status = true, message = String.Format("Playlist \"{0}\" was created!", newPlaylist.name), name = newPlaylist.name });
            }

            return new JsonResult(new CreatePlaylistStatus { status = false, message = "Couldn't create playlist. Try different name" });
        }
    }
}
