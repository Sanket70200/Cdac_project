using System;
using System.Collections.Generic;

namespace P20_Tran.Models
{
    public partial class Traveller
    {
        public int TravellerId { get; set; }
        public int? TouristId { get; set; }
        public int? BookingId { get; set; }

        public virtual Booking? Booking { get; set; }
        public virtual Tourist? Tourist { get; set; }
    }
}
