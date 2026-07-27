package com.example.P20_Auth.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.P20_Auth.Controller.Entity.Company;
import com.example.P20_Auth.Controller.Entity.Users;
import com.example.P20_Auth.DummyUseEntities.DummyCompany;
import com.example.P20_Auth.DummyUseEntities.DummyUser;
import com.example.P20_Auth.DummyUseEntities.Forgot_Password;
import com.example.P20_Auth.Service.Company_Service;
import com.example.P20_Auth.Service.UsersService;

@RestController
@RequestMapping("/auth")
public class AuthController {

@Autowired
UsersService Userser;

@Autowired
Company_Service ComSer;

@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody DummyUser login) {
  Users user = Userser.validateLogin(login.getUsername(), login.getPassword());
   if (user == null) {
       // Return a 401 Unauthorized response with a meaningful JSON message
       return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
   }
   System.out.println(user);
   return ResponseEntity.ok(user); // Return the user object as JSON if credentials are valid
}
 
    @PostMapping("/checkemail")
    public ResponseEntity<?> checkEmail(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (Userser.checkEmailExists(email)) {
            return ResponseEntity.ok(Map.of("status", "exists"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Email not found"));
        }
    }

    // Send OTP to email
    @PostMapping("/sendotp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Userser.sendOtp(email);
        return ResponseEntity.ok(Map.of("message", "OTP sent successfully"));
    }

    // Validate OTP
    @PostMapping("/validateotp")
    public ResponseEntity<?> validateOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        if (Userser.validateOtp(email, otp)) {
            return ResponseEntity.ok(Map.of("message", "OTP is valid"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid OTP"));
        }
    }

    // Reset Password
    @PostMapping("/updatepassword")
    public ResponseEntity<?> updatePassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");

        if (Userser.updatePassword(email, newPassword)) {
            return ResponseEntity.ok(Map.of("status", "success", "message", "Password updated successfully"));
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Error updating password"));
        }
    }

    @PostMapping("/newAdmin")
    public ResponseEntity<String> new_Admin(@RequestBody DummyUser ur )
    {
  return Userser.registerAdmin(ur);  
    }
   
    @PostMapping("/newUser")
public ResponseEntity<String> new_user(@RequestBody DummyUser ur )
{
return Userser.registerUser(ur);  
}
   
    @PostMapping("/newCompany")
    public ResponseEntity<String> new_Company(@RequestBody DummyCompany ducom )
    {
  Company com=new Company();
      com.setCompany_name(ducom.getCompany_name());
      com.setCompany_reg_no(ducom.getCompanyreg_no());
      Users ur=new Users();
      ur.setUsername(ducom.getUsername());
      ur.setPassword(ducom.getPassword());
      ur.setContactno(ducom.getContactno());
      ur.setEmail(ducom.getEmail());
      ur.setAddress(ducom.getAddress());
      com.setUser_id(ur);
       return ComSer.registerCompnay(com);
    }

}