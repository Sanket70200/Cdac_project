using System;
using System.Collections.Generic;

namespace P20_Tran.Models
{
    public partial class Feedback
    {
        public int FeedbackId { get; set; }
        public string? FeedbackDesc { get; set; }
        public int? Packageid { get; set; }
        public int? Rating { get; set; }
        public int? TouristId { get; set; }
    }
}
