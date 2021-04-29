using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MediaToolkit;
using MediaToolkit.Model;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Soundify.Models;

namespace Soundify.Pages
{
    public class AddSongModel : PageModel
    {
        private DatabaseContext _db;
        private readonly IWebHostEnvironment _hostingEnvironment;

        [BindProperty]
        public Music music { get; set; }
        public AddSongModel(DatabaseContext db, IWebHostEnvironment hostingEnvironment)
        {
            _db = db;
            music = new Music();
            _hostingEnvironment = hostingEnvironment;
        }

        [BindProperty]
        public IFormFile Upload { get; set; }
        public async Task OnPostAsync()
        {
            using (var memoryStream = new MemoryStream())
            {
                await Upload.CopyToAsync(memoryStream);
                if (memoryStream.Length < 100097152)
                {
                    string name = music.Name.Replace(" ", "_");
                    string path = Path.Combine(_hostingEnvironment.WebRootPath, "cdn", name + ".wav");
                    await System.IO.File.WriteAllBytesAsync(path, memoryStream.ToArray());

                    var inputFile = new MediaFile { Filename = path };

                    using (var engine = new Engine())
                    {
                        engine.GetMetadata(inputFile);
                    }

                    music.Duration = (int)inputFile.Metadata.Duration.TotalSeconds;
                    music.TrackName = name + ".wav";
                    _db.music.Add(music);

                    await _db.SaveChangesAsync();
                }
            }
        }
    }

}
