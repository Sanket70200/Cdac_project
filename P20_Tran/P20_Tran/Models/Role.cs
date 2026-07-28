using System;
using System.Collections.Generic;

namespace P20_Tran.Models
{
    public partial class Role
    {
        public Role()
        {
            Users = new HashSet<User>();
        }

        public int RoleId { get; set; }
        public string? RoleName { get; set; }
        public string? Desc { get; set; }

        public virtual ICollection<User> Users { get; set; }
    }
}
