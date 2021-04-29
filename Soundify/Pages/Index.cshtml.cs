using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Logging;
using Microsoft.Net.Http.Headers;
using NAudio.Wave;
using Soundify.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Soundify.Pages
{
    public class IndexModel : PageModel
    {
        private readonly ILogger<IndexModel> _logger;
        private DatabaseContext _db;
       
        public IndexModel(ILogger<IndexModel> logger, DatabaseContext db)
        {
            _logger = logger;
            _db = db;

        }

        public IList<Music> Musics { get; set; }
        public void OnGet()
        {
            Musics = _db.music.ToList();
        }
    }
}
