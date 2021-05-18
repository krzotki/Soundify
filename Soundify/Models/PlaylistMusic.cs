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
    [Table("PlaylistMusic")]
    
    public class PlaylistMusic
    {
        [Key]
        public int id { get; set; }

        [ForeignKey("playlist_music_playlists_fk")]
        [BindProperty]
        public int playlist_id { get; set; }

        [ForeignKey("playlist_music_music_fk")]
        [BindProperty]
        public int music_id { get; set; }
    }
}
