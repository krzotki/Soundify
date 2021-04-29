using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace Soundify.Models
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        public DbSet<Music> music { get; set; }
        public DbSet<Users> users { get; set; }
        public DbSet<Playlists> playlists { get; set; }
        public DbSet<PlaylistMusic> playlistMusic { get; set; }
    }
}
