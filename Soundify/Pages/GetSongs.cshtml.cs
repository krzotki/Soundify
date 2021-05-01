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
    public class GetSongsModel : PageModel
    {
        public DatabaseContext _db { get; set; }

        public GetSongsModel(DatabaseContext db)
        {
            _db = db;
        }

        public JsonResult OnGet(string name, string author, int playlist_id)
        {
            IEnumerable<Music> all = _db.music;

            int loggedUserId;
            int.TryParse(HttpContext.Session.GetInt32("LoggedUserId").ToString(), out loggedUserId);

            if (playlist_id != 0 && loggedUserId != 0)
            {
                all = from m in _db.music
                      join pm in _db.playlistMusic on m.Id equals pm.music_id
                      join p in _db.playlists on pm.playlist_id equals p.id
                      where
                      pm.playlist_id == playlist_id &&
                      p.user_id == loggedUserId
                      select m;
            }

            return new JsonResult(all.Where(m => m.Name.Contains(name != null ? name : "") &&
            m.Author.Contains(author != null ? author : "")));
        }
    }
}
