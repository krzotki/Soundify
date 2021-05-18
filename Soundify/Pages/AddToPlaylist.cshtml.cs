using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Soundify.Models;

namespace Soundify.Pages
{
    public class AddToPlaylistStatus
    {
        public string message { get; set; }
        public bool status { get; set; }
    }

    public class AddToPlaylistModel : PageModel
    {
        private DatabaseContext _db;

        public AddToPlaylistModel(DatabaseContext db)
        {
            _db = db;
        }

        public JsonResult OnPost([FromForm] PlaylistMusic playlistMusic)
        {
            _db.playlistMusic.Add(playlistMusic);
            if (_db.playlistMusic.Any(p => p.music_id == playlistMusic.music_id)) {
                return new JsonResult(new CreatePlaylistStatus { status = false, message = "This song already exists in given playlist" });
            } 

            if (_db.SaveChanges() > 0) {
                return new JsonResult(new CreatePlaylistStatus { status = true, message = "Song added to playlist!" });
            }

            return new JsonResult(new CreatePlaylistStatus { status = false, message = "Couldn't add song to playlist" });
        }
        public void OnGet()
        {
        }
    }
}
