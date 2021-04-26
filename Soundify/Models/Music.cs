using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.SqlTypes;

namespace Soundify.Models
{
    [Table("Music")]
    public class Music
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string TrackName { get; set; }

        public string Author { get; set; }

        public int Duration { get; set; }
    }
}
