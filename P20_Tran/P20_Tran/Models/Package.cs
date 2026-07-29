using System;
using System.Collections.Generic;

namespace P20_Tran.Models
{
    public partial class Package
    {
        public Package()
        {
            Trips = new HashSet<Trip>();
        }

        public int Packageid { get; set; }
        public int CompanyId { get; set; }
        public string? Description { get; set; }
        public string Source { get; set; } = null!;
        public string Destination { get; set; } = null!;
        public float PersonPerPackage { get; set; }
        public string? ImageDesc { get; set; }
        public string PackageName { get; set; } = null!;
        public int? PackageStatus { get; set; }

        public virtual Company Company { get; set; } = null!;
        public virtual ICollection<Trip> Trips { get; set; }
    }
}
