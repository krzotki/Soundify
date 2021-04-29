using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

            if (playlist_id != 0)
            {
                all = from m in _db.music
                      join pm in _db.playlistMusic on m.Id equals pm.music_id
                      where
                      pm.playlist_id == playlist_id
                      select m;
            }

            return new JsonResult(all.Where(m => m.Name.Contains(name != null ? name : "") &&
            m.Author.Contains(author != null ? author : "")));
        }
    }
}
