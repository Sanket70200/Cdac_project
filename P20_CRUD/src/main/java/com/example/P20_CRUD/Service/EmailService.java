package com.example.P20_CRUD.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(String toEmail, String userName, String tripDetails) {
        String subject = "Thank You for Booking Your Trip with Safar!";
        String message = "Dear " + userName + ",\n\n"
                + "Thank you for booking your trip with Safar!\n"
                + "Here are your trip details:\n" + tripDetails + "\n\n"
                + "We wish you a great journey!\n\n"
                + "Best Regards,\n"
                + "Safar Team";

        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(toEmail);
        mailMessage.setSubject(subject);
        mailMessage.setText(message);

        mailSender.send(mailMessage);
    }
    
    public void sendRegistrationConfirmation(String email, String userName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Welcome to Safar!");
        message.setText("Dear " + userName + ",\n\nThank you for registering with Safar! We are excited to have you onboard.\n\nHappy Travels!\nSafar Team");

        mailSender.send(message);
    }
}

