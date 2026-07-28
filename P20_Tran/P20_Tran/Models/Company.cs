using System;
using System.Collections.Generic;

namespace P20_Tran.Models
{
    public partial class Company
    {
        public Company()
        {
            Packages = new HashSet<Package>();
        }

        public int CompanyId { get; set; }
        public int? UserId { get; set; }
        public string? CompanyName { get; set; }
        public string CompanyRegNo { get; set; } = null!;

        public virtual User? User { get; set; }
        public virtual ICollection<Package> Packages { get; set; }
    }
}
