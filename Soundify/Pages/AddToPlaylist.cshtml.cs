using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Soundify.Models;

namespace Soundify.Pages
{ 
    public class AddToPlaylistModel : PageModel
    {
        private DatabaseContext _db;

        public AddToPlaylistModel(DatabaseContext db)
        {
            _db = db;
        }

        public JsonResult OnPost([FromForm] PlaylistMusic playlistMusic)
        {
            
            if (_db.playlistMusic.Any(p => p.music_id == playlistMusic.music_id && p.playlist_id == playlistMusic.playlist_id)) {
                return new JsonResult(new RequestStatus { status = false, message = "This song already exists in given playlist" });
            }

            _db.playlistMusic.Add(playlistMusic);

            if (_db.SaveChanges() > 0) {
                return new JsonResult(new RequestStatus { status = true, message = "Song added to playlist!" });
            }

            return new JsonResult(new RequestStatus { status = false, message = "Couldn't add song to playlist" });
        }

    }
}
