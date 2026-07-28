using System;
using System.Collections.Generic;

namespace P20_Tran.Models
{
    public partial class Trip
    {
        public Trip()
        {
            Addtowishlists = new HashSet<Addtowishlist>();
            Bookings = new HashSet<Booking>();
            Tourists = new HashSet<Tourist>();
        }

        public int TripId { get; set; }
        public int? Packageid { get; set; }
        public DateOnly? StartDate { get; set; }
        public DateOnly? EndDate { get; set; }
        public int? TouristAllowed { get; set; }
        public string? TourStatus { get; set; }
        public int? TripsStatus { get; set; }

        public virtual Package? Package { get; set; }
          public virtual ICollection<Addtowishlist> Addtowishlists { get; set; }
          public virtual ICollection<Booking> Bookings { get; set; }
          
        public virtual ICollection<Tourist> Tourists { get; set; }
    }
}
