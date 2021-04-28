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

        public JsonResult OnGet(string name, string author)
        {
            IEnumerable<Music> filteringQuery =
            from m in _db.Musics
            where m.Name.Contains(name != null ? name : "") &&
            m.Author.Contains(author != null ? author : "")
            select m;
            return new JsonResult(filteringQuery);
        }
    }
}
