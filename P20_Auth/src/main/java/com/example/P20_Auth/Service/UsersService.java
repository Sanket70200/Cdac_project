package com.example.P20_Auth.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.example.P20_Auth.Controller.Entity.Role;
import com.example.P20_Auth.Controller.Entity.Users;
import com.example.P20_Auth.DummyUseEntities.DummyUser;
import com.example.P20_Auth.Repository.Role_Repository;
import com.example.P20_Auth.Repository.User_Repository;

import jakarta.transaction.Transactional;

@Service
@Transactional
public class UsersService {

    @Autowired
    User_Repository User_repo;

    @Autowired
    Role_Repository Role_repo;

    @Autowired
    private JavaMailSender mailSender;

    public Users validateLogin(String username, String password) {

        Users u = User_repo.findByUsernameAndPassword(username, password);

        // System.out.println(u);
        return u;
    }

    private final Map<String, String> otpStorage = new HashMap<>();

    // Check if the email exists
    public boolean checkEmailExists(String email) {
        return User_repo.findByEmail(email).isPresent();
    }

    // Generate OTP and send email
    public void sendOtp(String email) {
        String otp = generateOtp();
        otpStorage.put(email, otp);

        // Send email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Password Reset OTP");
        message.setText("Your OTP for password reset is: " + otp);
        mailSender.send(message);
    }

    // Validate OTP
    public boolean validateOtp(String email, String otp) {
        return otpStorage.containsKey(email)
                && otpStorage.get(email).equals(otp);
    }

    // Update Password
    @Transactional
    public boolean updatePassword(String email, String newPassword) {
        Optional<Users> userOptional = User_repo.findByEmail(email);

        if (userOptional.isPresent()) {
            Users user = userOptional.get();
            user.setPassword(newPassword); // Consider hashing password
            User_repo.save(user);
            otpStorage.remove(email); // Clear OTP after successful password reset
            return true;
        }

        return false;
    }

    // Generate 6-digit OTP
    private String generateOtp() {
        return String.format("%06d", new Random().nextInt(999999));
    }

    public ResponseEntity<String> registerAdmin(DummyUser ur) {

        // System.out.print(ur);

        // Check if the username already exists
        if (User_repo.findByUsername(ur.getUsername()) > 0) {
            return new ResponseEntity<>(
                    "Username already taken",
                    HttpStatus.BAD_REQUEST
            );
        }

        // Set Role_Id and Account_Status if not provided
        Users newuser = new Users();

        newuser.setFirstname(ur.getFirstname());
        newuser.setLastname(ur.getLastname());
        newuser.setUsername(ur.getUsername());
        newuser.setPassword(ur.getPassword());
        newuser.setContactno(ur.getContactno());
        newuser.setEmail(ur.getEmail());
        newuser.setAddress(ur.getAddress());

        // Admin is active directly
        newuser.setAccountstatus(1);

        Role role = Role_repo.findById(1)
                .orElseThrow(() ->
                        new RuntimeException("Role not found with ID: 1"));

        newuser.setRole_id(role);

        if (ur.getFirstname() == null || ur.getLastname().isEmpty()) {
            throw new IllegalArgumentException(
                    "First name cannot be null or empty"
            );
        }

        // Validate all fields are not null
        if (ur.getUsername() == null
                || ur.getPassword() == null
                || ur.getFirstname() == null
                || ur.getLastname() == null
                || ur.getContactno() == null
                || ur.getEmail() == null
                || ur.getAddress() == null) {

            return new ResponseEntity<>(
                    "All fields are required",
                    HttpStatus.BAD_REQUEST
            );
        }

        // Save the new user
        User_repo.save(newuser);

        return new ResponseEntity<>(
                "User registered successfully",
                HttpStatus.OK
        );
    }

    public ResponseEntity<String> registerUser(DummyUser ur) {

        System.out.print(ur);

        // Check if the username already exists
        if (User_repo.findByUsername(ur.getUsername()) > 0) {
            return new ResponseEntity<>(
                    "Username already taken",
                    HttpStatus.BAD_REQUEST
            );
        }

        // Set Role_Id and Account_Status if not provided
        Users newuser = new Users();

        newuser.setFirstname(ur.getFirstname());
        newuser.setLastname(ur.getLastname());
        newuser.setUsername(ur.getUsername());
        newuser.setPassword(ur.getPassword());
        newuser.setContactno(ur.getContactno());
        newuser.setEmail(ur.getEmail());
        newuser.setAddress(ur.getAddress());

        // Tourist must wait for Admin approval
        newuser.setAccountstatus(0);

        Role role = Role_repo.findById(2)
                .orElseThrow(() ->
                        new RuntimeException("Role not found with ID: 2"));

        newuser.setRole_id(role);

        if (ur.getFirstname() == null || ur.getLastname().isEmpty()) {
            throw new IllegalArgumentException(
                    "First name cannot be null or empty"
            );
        }

        // Validate all fields are not null
        if (ur.getUsername() == null
                || ur.getPassword() == null
                || ur.getFirstname() == null
                || ur.getLastname() == null
                || ur.getContactno() == null
                || ur.getEmail() == null
                || ur.getAddress() == null) {

            return new ResponseEntity<>(
                    "All fields are required",
                    HttpStatus.BAD_REQUEST
            );
        }

        // Save the new user
        User_repo.save(newuser);

        return new ResponseEntity<>(
                "User registered successfully",
                HttpStatus.OK
        );
    }
}
