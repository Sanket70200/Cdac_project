using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using P20_Tran.Models;
using P20_Tran.DTO;

namespace P20_Tran.Service
{
    public class AdminService
    {
        private readonly p20_safar1Context _context;

        public AdminService(p20_safar1Context context)
        {
            _context = context;
        }

        public async Task<List<Company>> GetAllActiveCompaniesAsync()
        {
            return await _context.Companies.Include(c => c.Packages).Where(c => c.UserId != null).ToListAsync();
        }

        public async Task<List<Company>> GetForApprovalAsync()
        {
            return await _context.Companies.Where(c => c.UserId == null).ToListAsync();
        }

        public async Task<bool> ApproveCompanyAsync(int companyId)
        {
            var company = await _context.Companies.FindAsync(companyId);
            if (company == null)
                return false;

            company.UserId = company.CompanyId; // Assuming approval links userId to companyId
            _context.Companies.Update(company);
            return await _context.SaveChangesAsync() > 0;
        }

        //public async Task<bool> DeleteCompanyAsync(int companyId)
        //{
        //    // Fetch the company along with the associated user
        //    var company = await _context.Companies.FirstOrDefaultAsync(c => c.UserId == companyId);
        //    Console.WriteLine(company);
        //    if (company == null)
        //        return false;

        //    // Set the user's account status to 0
        //    company.User.AccountStatus = 0;

        //    // Save changes to persist the update
        //    return await _context.SaveChangesAsync() > 0;
        //}

    }

    public class TripsService
    {
        private readonly p20_safar1Context _context;

        public TripsService(p20_safar1Context context)
        {
            _context = context;
        }

        public async Task<List<TripDto>> GetAllTripsAsync()
        {
            return await _context.Trips
                .AsNoTracking()
                .Where(t => t.TripsStatus == 1 && t.Package != null)
                .Select(t => new TripDto
                {
                    TripId = t.TripId,
                    TripName = t.Package!.PackageName,
                    Destination = t.Package.Destination,
                    StartDate = t.StartDate,
                    EndDate = t.EndDate,
                    Price = t.Package.PersonPerPackage,
                    Description = t.Package.Description,
                    CompanyId = t.Package.CompanyId,
                    Imgdesc = t.Package.ImageDesc
                })
                .ToListAsync();
        }



        public async Task<bool> DeleteTripAsync(int tripId)
        {
            if (!await _context.Trips.AnyAsync(t => t.TripId == tripId))
                return false;

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await DeleteTripDataAsync(tripId);
                await transaction.CommitAsync();
                return true;
            }
            catch
            {
                await transaction.RollbackAsync();
                return false;
            }
        }

        public async Task<(bool Success, string Message)> DeletePackageAsync(int packageId)
        {
            if (!await _context.Packages.AnyAsync(p => p.Packageid == packageId))
                return (false, "Package was not found.");

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                await DeletePackageDataAsync(packageId);
                await transaction.CommitAsync();
                return (true, "Package, trips, bookings, and related records were deleted permanently.");
            }
            catch
            {
                await transaction.RollbackAsync();
                return (false, "Package deletion failed. No records were removed.");
            }
        }

        public async Task DeletePackageDataAsync(int packageId)
        {
            var tripIds = await _context.Trips
                .Where(t => t.Packageid == packageId)
                .Select(t => t.TripId)
                .ToListAsync();

            foreach (var tripId in tripIds)
            {
                await DeleteTripDataAsync(tripId);
            }

            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM feedback WHERE packageid = {packageId}");
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM package WHERE packageid = {packageId}");
        }

        private async Task DeleteTripDataAsync(int tripId)
        {
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM feedback WHERE tourist_id IN (SELECT tourist_id FROM tourist WHERE trip_id = {tripId})");
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM traveller WHERE booking_id IN (SELECT booking_id FROM booking WHERE trip_id = {tripId}) OR tourist_id IN (SELECT tourist_id FROM tourist WHERE trip_id = {tripId})");
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM addtowishlist WHERE trip_id = {tripId}");
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM addtocart WHERE trip_id = {tripId}");
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM booking WHERE trip_id = {tripId}");
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM tourist WHERE trip_id = {tripId}");
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM trips WHERE trip_id = {tripId}");
        }

    }

    public class UserService
    {
        private readonly p20_safar1Context _context;

        public UserService(p20_safar1Context context)
        {
            _context = context;
        }

        public async Task<bool> RegisterAdminAsync(DummyUser user)
        {
            var newUser = new User
            {
                RoleId = 1,
                Username = user.Username,
                Password = user.Password,
                Firstname = user.Firstname,
                Lastname = user.Lastname,
                Contactno = user.Contactno,
                Email = user.Email,
                Address = user.Address,
                AccountStatus = 1
            };
            _context.Users.Add(newUser);
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<User>> GetAllInactiveUsersAsync()
        {
            return await _context.Users
                                 .Where(u => u.AccountStatus == 0 && u.RoleId == 2) // Fetch only inactive users
                                 .ToListAsync();
        }

        public async Task<bool> ActivateUserAsync(int userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.UserId == userId);
            if (user == null)
                return false;

            user.AccountStatus = 1; // Set user as active
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<List<User>> GetAllActiveUsersAsync()
        {
            return await _context.Users
                                 .Where(u => u.AccountStatus == 1  && u.RoleId==2) // Fetch only active users
                                 .ToListAsync();
        }


        public async Task<bool> DeleteUserAsync(int userId)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.UserId == userId);

            if (user == null)
                return false;

            user.AccountStatus = 0; // Set account as inactive

            return await _context.SaveChangesAsync() > 0;
        }
    }

    public class CompanyService
    {
        private readonly p20_safar1Context _context;
        private readonly TripsService _tripsService;

        public CompanyService(p20_safar1Context context, TripsService tripsService)
        {
            _context = context;
            _tripsService = tripsService;
        }

        public async Task<List<CompanyDto>> GetAllActiveCompaniesAsync()
        {
            return await _context.Companies
                .Where(c => c.User.AccountStatus==1)
                .Select(c => new CompanyDto
                {
                    CompanyId = c.CompanyId,
                    Name = c.CompanyName,
                    Email = c.User.Email,
                    PhoneNumber = c.User.Contactno,
                    Address = c.User.Address,
                    UserId = c.UserId
                    // Excluding Packages
                })
                .ToListAsync();
        }


        public async Task<List<CompanyDto>> GetForApprovalAsync()
        {
            return await _context.Companies
                .Where(c => c.User.AccountStatus == 0)
                .Select(c => new CompanyDto
                {
                    CompanyId = c.CompanyId,
                    Name = c.CompanyName,
                    Email = c.User.Email,
                    PhoneNumber = c.User.Contactno,
                    Address = c.User.Address,
                    UserId = c.UserId
                    // Excluding Packages
                })
                .ToListAsync();
        }


        public async Task<bool> ApproveCompanyAsync(int companyId)
        {
            var company = await _context.Companies
                .Include(c => c.User) // Include User to update AccountStatus
                .FirstOrDefaultAsync(c => c.CompanyId == companyId);

            if (company == null)
                return false;

            company.User.AccountStatus = 1; // Set account as inactive

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<(bool Success, string Message)> DeleteCompanyAsync(int userId)
        {
            var company = await _context.Companies
                .AsNoTracking()
                .FirstOrDefaultAsync(c => c.UserId == userId);

            if (company == null)
                return (false, "Company account was not found.");

            await using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var packageIds = await _context.Packages
                    .Where(p => p.CompanyId == company.CompanyId)
                    .Select(p => p.Packageid)
                    .ToListAsync();

                foreach (var packageId in packageIds)
                {
                    await _tripsService.DeletePackageDataAsync(packageId);
                }

                await DeleteUserRelatedDataAsync(userId);
                await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM company WHERE company_id = {company.CompanyId}");
                await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM users WHERE user_id = {userId}");
                await transaction.CommitAsync();
                return (true, "Company, packages, trips, and related records were deleted permanently.");
            }
            catch
            {
                await transaction.RollbackAsync();
                return (false, "Company deletion failed. No records were removed.");
            }
        }

        private async Task DeleteUserRelatedDataAsync(int userId)
        {
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM feedback WHERE tourist_id IN (SELECT tourist_id FROM tourist WHERE user_id = {userId})");
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM traveller WHERE booking_id IN (SELECT booking_id FROM booking WHERE user_id = {userId}) OR tourist_id IN (SELECT tourist_id FROM tourist WHERE user_id = {userId})");
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM addtowishlist WHERE user_id = {userId}");
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM addtocart WHERE user_id = {userId}");
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM booking WHERE user_id = {userId}");
            await _context.Database.ExecuteSqlInterpolatedAsync($"DELETE FROM tourist WHERE user_id = {userId}");
        }
    }
}