using System;
using System.Collections.Generic;

namespace P20_Tran.Models
{
    public partial class Addtowishlist
    {
        public int WishId { get; set; }
        public int? UserId { get; set; }
        public int? TripId { get; set; }

        public virtual Trip? Trip { get; set; }
        public virtual User? User { get; set; }
    }
}
