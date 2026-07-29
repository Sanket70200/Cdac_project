using System;
using System.Collections.Generic;

namespace P20_Tran.Models
{
    public partial class Booking
    {
        public Booking()
        {
            Payments = new HashSet<Payment>();
            Travellers = new HashSet<Traveller>();
        }

        public int BookingId { get; set; }
        public int? TripId { get; set; }
        public int? UserId { get; set; }
        public string? PaymentStatus { get; set; }
        public string? Amount { get; set; }
        public int NoOfBookings { get; set; }

        public virtual Trip? Trip { get; set; }
        public virtual User? User { get; set; }
        public virtual ICollection<Payment> Payments { get; set; }
        public virtual ICollection<Traveller> Travellers { get; set; }
    }
}
