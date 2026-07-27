package com.example.P20_Auth.Repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.P20_Auth.Controller.Entity.Users;

@Repository
public interface User_Repository extends JpaRepository<Users, Integer> {

    @Query("SELECT u FROM Users u WHERE u.username = :username AND u.password = :pwd AND u.accountstatus = 1")
    public Users findByUsernameAndPassword(
            @Param("username") String username,
            @Param("pwd") String pwd
    );

    @Modifying
    @Query("UPDATE Users u SET u.password = :pwd WHERE u.username = :username")
    public int updatepassword(
            @Param("username") String username,
            @Param("pwd") String pwd
    );

    @Query("""
           SELECT COUNT(u)
           FROM Users u
           WHERE u.username = :username
           AND u.email = :email
           AND u.contactno = :contact
           AND u.accountstatus = 1
           """)
    public int findByEmail(
            @Param("username") String username,
            @Param("email") String email,
            @Param("contact") String contact
    );

    Optional<Users> findByEmail(String email);

    @Query("SELECT COUNT(u) FROM Users u WHERE u.username = :username")
    public int findByUsername(@Param("username") String username);

    @Query("SELECT COUNT(u) FROM Users u WHERE u.contactno = :contactno")
    public int findByContact(@Param("contactno") String contactno);
}
