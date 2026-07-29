using System;
using System.Collections.Generic;

namespace P20_Tran.Models
{
    public partial class Tourist
    {
        public Tourist()
        {
            Payments = new HashSet<Payment>();
            Travellers = new HashSet<Traveller>();
        }

        public int TouristId { get; set; }
        public int? UserId { get; set; }
        public int Age { get; set; }
        public string? Gender { get; set; }
        public string? AdharNo { get; set; }
        public int? TripId { get; set; }
        public string? Firstname { get; set; }
        public string? Lastname { get; set; }

        public virtual Trip? Trip { get; set; }
        public virtual User? User { get; set; }
        public virtual ICollection<Payment> Payments { get; set; }
        public virtual ICollection<Traveller> Travellers { get; set; }
    }
}
