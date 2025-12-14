package ru.web.itmo_web_lab_4.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_web")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;
}