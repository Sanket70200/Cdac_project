using System;
using System.Collections.Generic;

namespace P20_Tran.Models
{
    public partial class Payment
    {
        public int PaymentId { get; set; }
        public int? TouristId { get; set; }
        public int? BookingId { get; set; }
        public string PaymentStatus { get; set; } = null!;
        public long Amount { get; set; }
        public DateOnly TransactionDate { get; set; }
        public int TransactionId { get; set; }

        public virtual Booking? Booking { get; set; }
        public virtual Tourist? Tourist { get; set; }
    }
}
