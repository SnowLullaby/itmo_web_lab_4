package ru.web.itmo_web_lab_4.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import ru.web.itmo_web_lab_4.entity.Point;
import ru.web.itmo_web_lab_4.repository.PointRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PointService {

    private final PointRepository repository;
    private final AreaCheckService areaCheckService;

    public List<Point> addPointsBatch(Double x, Double y, List<Double> zValues, Double r) {
        if (x == null || y == null || zValues == null || zValues.isEmpty() || r == null || r <= 0) {
            throw new IllegalArgumentException("Invalid input data");
        }

        List<Point> points = new ArrayList<>();

        long start = System.nanoTime();

        for (Double z : zValues) {
            if (z == null) continue;

            boolean hit = areaCheckService.checkHit(x, y, z, r);

            long executionTimeNs = System.nanoTime() - start;

            Point point = new Point();
            point.setX(x);
            point.setY(y);
            point.setZ(z);
            point.setR(r);
            point.setHit(hit);
            point.setCurrentTime(LocalDateTime.now());
            point.setExecutionTimeNs(executionTimeNs);

            points.add(point);
        }

        return repository.saveAll(points);
    }

    public List<Point> getAllPoints() {
        return repository.findAll();
    }

    public void clearPoints() {
        repository.deleteAll();
    }
}