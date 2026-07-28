using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using P20_Tran.DTO;
using P20_Tran.Models;
using P20_Tran.Service;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace P20_Tran.Controllers
{
    [Route("admin")]
    [ApiController]
    //[EnableCors("AllowLocalhost3020")]  // Enable CORS for localhost:3020
    public class AdminController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly TripsService _tripsService;
        private readonly CompanyService _companyService;

        public AdminController(UserService userService, TripsService tripsService, CompanyService companyService)
        {
            _userService = userService;
            _tripsService = tripsService;
            _companyService = companyService;
        }

        [HttpPost("newAdmin")]
        public async Task<IActionResult> RegisterAdmin([FromBody] DummyUser user)
        {
            var result = await _userService.RegisterAdminAsync(user);
            return result ? Ok("Admin registered successfully.") : BadRequest("Admin registration failed.");
        }

        [HttpGet("getActiveTrips")]
        public async Task<IActionResult> GetAllActiveTrips()
        {
            var trips = await _tripsService.GetAllTripsAsync();
            return Ok(trips);
        }

        [HttpGet("getForApproveCompanies")]
        public async Task<IActionResult> GetCompaniesForApproval()
        {
            var companies = await _companyService.GetForApprovalAsync();
            return Ok(companies);
        }

        [HttpGet("getAllActiveCompanies")]
        public async Task<IActionResult> GetAllActiveCompanies()
        {
            var companies = await _companyService.GetAllActiveCompaniesAsync();
            return Ok(companies);
        }

        [HttpGet("allActiveUsers")]
        public async Task<IActionResult> GetAllActiveUsers()
        {
            var users = await _userService.GetAllActiveUsersAsync(); // Fetch only active users
            return Ok(users);
        }


        [HttpGet("allInactiveUsers")]
        public async Task<IActionResult> GetAllInactiveUsers()
        {
            var users = await _userService.GetAllInactiveUsersAsync();
            return Ok(users);
        }



        [HttpPut("deleteCompany")]
        public async Task<IActionResult> DeleteCompany([FromBody] GetCompanyId request)
        {
            var result = await _companyService.DeleteCompanyAsync(request.UserId);
            return result.Success
                ? Ok(new { message = result.Message })
                : Conflict(new { message = result.Message });
        }

        [HttpPut("approveCompany")]
        public async Task<IActionResult> ApproveCompany([FromBody] GetCompanyId request)
        {
            var result = await _userService.ActivateUserAsync(request.UserId);
            return result ? Ok(new { message = "Company approved successfully." }) : BadRequest(new { message = "Company approval failed." });
        }

        [HttpPut("deleteUser")]
        public async Task<IActionResult> DeleteUser([FromBody] GetUserId request)
        {
            var result = await _userService.DeleteUserAsync(request.UserId);
            return result ? Ok(new { message = "User deleted successfully." })
                          : BadRequest(new { message = "User deletion failed." });
        }

        [HttpPut("activateUser")]
        public async Task<IActionResult> ActivateUser([FromBody] GetUserId request)
        {
            var result = await _userService.ActivateUserAsync(request.UserId);
            return result ? Ok(new { message = "User activated successfully." })
                          : BadRequest(new { message = "User activation failed." });
        }



        [HttpPut("deleteTrip")]
        public async Task<IActionResult> DeleteTrip([FromBody] GetTripId request)
        {
            var result = await _tripsService.DeleteTripAsync(request.TripId);
            return result ? Ok(new { message = "Trip and its related records were deleted permanently." })
                          : BadRequest(new { message = "Trip deletion failed." });
        }

        [HttpPut("deletePackage")]
        public async Task<IActionResult> DeletePackage([FromBody] GetPackageId request)
        {
            var result = await _tripsService.DeletePackageAsync(request.PackageId);
            return result.Success
                ? Ok(new { message = result.Message })
                : BadRequest(new { message = result.Message });
        }
    }
}
