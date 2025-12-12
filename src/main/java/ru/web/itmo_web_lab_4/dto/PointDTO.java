package ru.web.itmo_web_lab_4.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PointDTO {
    private Double x;
    private Double y;
    private List<Double> z;
    private Double r;
}
