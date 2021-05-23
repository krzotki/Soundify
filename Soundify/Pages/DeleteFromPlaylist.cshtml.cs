using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Soundify.Models;

namespace Soundify.Pages
{
    public class DeleteFromPlaylistModel : PageModel
    {
        private DatabaseContext _db;
        public DeleteFromPlaylistModel(DatabaseContext db)
        {
            _db = db;
        }

        public JsonResult OnGet(int playlistId, int musicId)
        {
            PlaylistMusic playlistMusic = _db.playlistMusic.Where(p => p.music_id == musicId && p.playlist_id == playlistId).FirstOrDefault();

            if (playlistMusic != null)
            {
                _db.playlistMusic.Remove(playlistMusic);
                _db.SaveChanges();

                return new JsonResult(new RequestStatus { status = true, message = "Song deleted from playlist" });
            }

            return new JsonResult(new RequestStatus { status = false, message = "Couldn't delete song from playlist" });
        }
    }
}
