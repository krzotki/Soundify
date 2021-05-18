using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.SqlTypes;
using Microsoft.AspNetCore.Mvc;

namespace Soundify.Models
{
    [Table("Playlists")]
    public class Playlists
    {
        [Key]
        public int id { get; set; }
        [BindProperty]
        public string name { get; set; }

        [ForeignKey("playlist_music_playlists_fk")]
        public int user_id { get; set; }
    }
}
