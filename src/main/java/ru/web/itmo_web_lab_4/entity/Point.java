package ru.web.itmo_web_lab_4.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonFormat;

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

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd' 'HH:mm:ss")
    private LocalDateTime currentTime;

    private long executionTimeNs;
}