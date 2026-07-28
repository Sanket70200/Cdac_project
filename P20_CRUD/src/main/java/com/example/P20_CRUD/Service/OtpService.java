package com.example.P20_CRUD.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    // Store OTPs temporarily (Use Redis/DB for production)
    private Map<String, String> otpStorage = new HashMap<>();

    // Generate 6-digit OTP
    public String generateOtp() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    // Send OTP via email
    public void sendOtp(String email) {
        String otp = generateOtp();
        otpStorage.put(email, otp); // Store OTP against email

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Your OTP Code");
        message.setText("Your OTP is: " + otp);

        mailSender.send(message);
        System.out.println("OTP sent successfully to " + email);
    }

    // Validate OTP
    public boolean validateOtp(String email, String enteredOtp) {
        String storedOtp = otpStorage.get(email);
        return storedOtp != null && storedOtp.equals(enteredOtp);
    }
}
