package ru.web.itmo_web_lab_4.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "points")
@Getter
@Setter
public class Point {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private double x;
    private double y;
    private double z;
    private double r;
    private boolean hit;
    private LocalDateTime currentTime;
    private long executionTimeNs;
}