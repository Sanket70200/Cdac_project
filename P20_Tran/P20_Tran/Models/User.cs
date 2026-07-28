using System;
using System.Collections.Generic;

namespace P20_Tran.Models
{
    public partial class User
    {
        public User()
        {
            Addtowishlists = new HashSet<Addtowishlist>();
            Bookings = new HashSet<Booking>();
            Companies = new HashSet<Company>();
            Tourists = new HashSet<Tourist>();
        }

        public int UserId { get; set; }
        public int RoleId { get; set; }
        public string Username { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Firstname { get; set; } = null!;
        public string Lastname { get; set; } = null!;
        public string Contactno { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Address { get; set; } = null!;
        public int? AccountStatus { get; set; }

        public virtual Role Role { get; set; } = null!;
        public virtual ICollection<Addtowishlist> Addtowishlists { get; set; }
        public virtual ICollection<Booking> Bookings { get; set; }
        public virtual ICollection<Company> Companies { get; set; }
        public virtual ICollection<Tourist> Tourists { get; set; }
    }
}
