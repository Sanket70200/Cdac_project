using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace P20_Tran.Models
{
    public partial class p20_safar1Context : DbContext
    {
        public p20_safar1Context()
        {
        }

        public p20_safar1Context(DbContextOptions<p20_safar1Context> options)
            : base(options)
        {
        }

        public virtual DbSet<Addtocart> Addtocarts { get; set; } = null!;
        public virtual DbSet<Addtowishlist> Addtowishlists { get; set; } = null!;
        public virtual DbSet<Booking> Bookings { get; set; } = null!;
        public virtual DbSet<Company> Companies { get; set; } = null!;
        public virtual DbSet<Feedback> Feedbacks { get; set; } = null!;
        public virtual DbSet<Package> Packages { get; set; } = null!;
        public virtual DbSet<Payment> Payments { get; set; } = null!;
        public virtual DbSet<Role> Roles { get; set; } = null!;
        public virtual DbSet<Tourist> Tourists { get; set; } = null!;
        public virtual DbSet<Traveller> Travellers { get; set; } = null!;
        public virtual DbSet<Trip> Trips { get; set; } = null!;
        public virtual DbSet<User> Users { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseMySql("server=localhost;port=3306;user=root;password=root;database=p20_safar1", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.2.0-mysql"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.UseCollation("utf8mb4_0900_ai_ci")
                .HasCharSet("utf8mb4");

            modelBuilder.Entity<Addtocart>(entity =>
            {
                entity.HasKey(e => e.CardId)
                    .HasName("PRIMARY");

                entity.ToTable("addtocart");

                entity.Property(e => e.CardId).HasColumnName("card_id");

                entity.Property(e => e.TripId).HasColumnName("trip_id");

                entity.Property(e => e.UserId).HasColumnName("user_id");
            });

            modelBuilder.Entity<Addtowishlist>(entity =>
            {
                entity.HasKey(e => e.WishId)
                    .HasName("PRIMARY");

                entity.ToTable("addtowishlist");

                entity.HasIndex(e => e.TripId, "wishtripid_idx");

                entity.HasIndex(e => e.UserId, "wishuser_idx");

                entity.Property(e => e.WishId).HasColumnName("wish_id");

                entity.Property(e => e.TripId).HasColumnName("trip_id");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.Trip)
                    .WithMany(p => p.Addtowishlists)
                    .HasForeignKey(d => d.TripId)
                    .HasConstraintName("wishtripid");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Addtowishlists)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("wishuser");
            });

            modelBuilder.Entity<Booking>(entity =>
            {
                entity.ToTable("booking");

                entity.HasIndex(e => e.TripId, "FTour_ID_idx");

                entity.HasIndex(e => e.UserId, "FUserid_idx");

                entity.Property(e => e.BookingId).HasColumnName("booking_id");

                entity.Property(e => e.Amount)
                    .HasMaxLength(255)
                    .HasColumnName("amount");

                entity.Property(e => e.NoOfBookings).HasColumnName("no_of_bookings");

                entity.Property(e => e.PaymentStatus)
                    .HasMaxLength(255)
                    .HasColumnName("payment_status");

                entity.Property(e => e.TripId).HasColumnName("trip_id");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.Trip)
                    .WithMany(p => p.Bookings)
                    .HasForeignKey(d => d.TripId)
                    .HasConstraintName("FTour_ID");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Bookings)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FUserid");
            });

            modelBuilder.Entity<Company>(entity =>
            {
                entity.ToTable("company");

                entity.HasIndex(e => e.CompanyRegNo, "Company_Reg_No_UNIQUE")
                    .IsUnique();

                entity.HasIndex(e => e.UserId, "FUser_Id_idx");

                entity.Property(e => e.CompanyId).HasColumnName("company_id");

                entity.Property(e => e.CompanyName)
                    .HasMaxLength(255)
                    .HasColumnName("company_name");

                entity.Property(e => e.CompanyRegNo).HasColumnName("company_reg_no");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Companies)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FUser_Id");
            });

            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.ToTable("feedback");

                entity.Property(e => e.FeedbackId).HasColumnName("feedback_id");

                entity.Property(e => e.FeedbackDesc)
                    .HasMaxLength(255)
                    .HasColumnName("feedback_desc");

                entity.Property(e => e.Packageid).HasColumnName("packageid");

                entity.Property(e => e.Rating).HasColumnName("rating");

                entity.Property(e => e.TouristId).HasColumnName("tourist_id");
            });

            modelBuilder.Entity<Package>(entity =>
            {
                entity.ToTable("package");

                entity.HasIndex(e => e.CompanyId, "FCompany_ID_idx");

                entity.Property(e => e.Packageid).HasColumnName("packageid");

                entity.Property(e => e.CompanyId).HasColumnName("company_id");

                entity.Property(e => e.Description)
                    .HasColumnType("text")
                    .HasColumnName("description");

                entity.Property(e => e.Destination)
                    .HasMaxLength(255)
                    .HasColumnName("destination");

                entity.Property(e => e.ImageDesc)
                    .HasColumnType("text")
                    .HasColumnName("image_desc");

                entity.Property(e => e.PackageName)
                    .HasMaxLength(255)
                    .HasColumnName("package_name");

                entity.Property(e => e.PackageStatus).HasColumnName("package_status");

                entity.Property(e => e.PersonPerPackage).HasColumnName("person_per_package");

                entity.Property(e => e.Source)
                    .HasMaxLength(255)
                    .HasColumnName("source");

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.Packages)
                    .HasForeignKey(d => d.CompanyId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FCompany_ID");
            });

            modelBuilder.Entity<Payment>(entity =>
            {
                entity.ToTable("payment");

                entity.HasIndex(e => e.BookingId, "FPBooking_ID_idx");

                entity.HasIndex(e => e.TouristId, "FPTourist_ID_idx");

                entity.HasIndex(e => e.TransactionId, "Transaction_ID_UNIQUE")
                    .IsUnique();

                entity.Property(e => e.PaymentId).HasColumnName("Payment_ID");

                entity.Property(e => e.BookingId).HasColumnName("Booking_ID");

                entity.Property(e => e.PaymentStatus)
                    .HasMaxLength(45)
                    .HasColumnName("Payment_Status");

                entity.Property(e => e.TouristId).HasColumnName("Tourist_ID");

                entity.Property(e => e.TransactionDate).HasColumnName("Transaction_Date");

                entity.Property(e => e.TransactionId).HasColumnName("Transaction_ID");

                entity.HasOne(d => d.Booking)
                    .WithMany(p => p.Payments)
                    .HasForeignKey(d => d.BookingId)
                    .HasConstraintName("FPBooking_ID");

                entity.HasOne(d => d.Tourist)
                    .WithMany(p => p.Payments)
                    .HasForeignKey(d => d.TouristId)
                    .HasConstraintName("FPTourist_ID");
            });

            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("role");

                entity.HasIndex(e => e.RoleName, "Role_name_UNIQUE")
                    .IsUnique();

                entity.Property(e => e.RoleId).HasColumnName("role_id");

                entity.Property(e => e.Desc)
                    .HasMaxLength(255)
                    .HasColumnName("desc");

                entity.Property(e => e.RoleName).HasColumnName("role_name");
            });

            modelBuilder.Entity<Tourist>(entity =>
            {
                entity.ToTable("tourist");

                entity.HasIndex(e => e.AdharNo, "Adhar_NO_UNIQUE")
                    .IsUnique();

                entity.HasIndex(e => e.UserId, "FTUser_ID_idx");

                entity.HasIndex(e => e.TripId, "Trip_id_idx");

                entity.Property(e => e.TouristId).HasColumnName("tourist_id");

                entity.Property(e => e.AdharNo).HasColumnName("adhar_no");

                entity.Property(e => e.Age).HasColumnName("age");

                entity.Property(e => e.Firstname)
                    .HasMaxLength(255)
                    .HasColumnName("firstname");

                entity.Property(e => e.Gender)
                    .HasMaxLength(255)
                    .HasColumnName("gender");

                entity.Property(e => e.Lastname)
                    .HasMaxLength(255)
                    .HasColumnName("lastname");

                entity.Property(e => e.TripId).HasColumnName("trip_id");

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.HasOne(d => d.Trip)
                    .WithMany(p => p.Tourists)
                    .HasForeignKey(d => d.TripId)
                    .HasConstraintName("Trip_id");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.Tourists)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FTUser_ID");
            });

            modelBuilder.Entity<Traveller>(entity =>
            {
                entity.ToTable("traveller");

                entity.HasIndex(e => e.BookingId, "FBooking_ID_idx");

                entity.HasIndex(e => e.TouristId, "FTTourist_ID_idx");

                entity.Property(e => e.TravellerId).HasColumnName("Traveller_ID");

                entity.Property(e => e.BookingId).HasColumnName("Booking_ID");

                entity.Property(e => e.TouristId).HasColumnName("Tourist_ID");

                entity.HasOne(d => d.Booking)
                    .WithMany(p => p.Travellers)
                    .HasForeignKey(d => d.BookingId)
                    .HasConstraintName("FBooking_ID");

                entity.HasOne(d => d.Tourist)
                    .WithMany(p => p.Travellers)
                    .HasForeignKey(d => d.TouristId)
                    .HasConstraintName("FTTourist_ID");
            });

            modelBuilder.Entity<Trip>(entity =>
            {
                entity.ToTable("trips");

                entity.HasIndex(e => e.Packageid, "FPackage_ID_idx");

                entity.Property(e => e.TripId).HasColumnName("trip_id");

                entity.Property(e => e.EndDate).HasColumnName("end_date");

                entity.Property(e => e.Packageid).HasColumnName("packageid");

                entity.Property(e => e.StartDate).HasColumnName("start_date");

                entity.Property(e => e.TourStatus)
                    .HasMaxLength(45)
                    .HasColumnName("tour_status");

                entity.Property(e => e.TouristAllowed).HasColumnName("tourist_allowed");

                entity.Property(e => e.TripsStatus).HasColumnName("trips_status");

                entity.HasOne(d => d.Package)
                    .WithMany(p => p.Trips)
                    .HasForeignKey(d => d.Packageid)
                    .HasConstraintName("FKqbpx34j378orw1sv98f0hfw7j");
            });

            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");

                entity.HasIndex(e => e.Contactno, "Contact_NO_UNIQUE")
                    .IsUnique();

                entity.HasIndex(e => e.RoleId, "FRole_ID_idx");

                entity.HasIndex(e => e.Username, "Username_UNIQUE")
                    .IsUnique();

                entity.Property(e => e.UserId).HasColumnName("user_id");

                entity.Property(e => e.AccountStatus).HasColumnName("account_status");

                entity.Property(e => e.Address)
                    .HasMaxLength(255)
                    .HasColumnName("address")
                    .HasDefaultValueSql("'Company'");

                entity.Property(e => e.Contactno).HasColumnName("contactno");

                entity.Property(e => e.Email)
                    .HasMaxLength(255)
                    .HasColumnName("email");

                entity.Property(e => e.Firstname)
                    .HasMaxLength(255)
                    .HasColumnName("firstname")
                    .HasDefaultValueSql("'Company'");

                entity.Property(e => e.Lastname)
                    .HasMaxLength(255)
                    .HasColumnName("lastname")
                    .HasDefaultValueSql("'Company'");

                entity.Property(e => e.Password)
                    .HasMaxLength(255)
                    .HasColumnName("password");

                entity.Property(e => e.RoleId).HasColumnName("role_id");

                entity.Property(e => e.Username).HasColumnName("username");

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.Users)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FRole_ID");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
