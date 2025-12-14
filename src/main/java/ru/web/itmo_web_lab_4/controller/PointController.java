package ru.web.itmo_web_lab_4.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.web.itmo_web_lab_4.dto.PointDTO;
import ru.web.itmo_web_lab_4.entity.Point;
import ru.web.itmo_web_lab_4.service.PointService;

import java.util.List;

@RestController
@RequestMapping("/api/points")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
//@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
@RequiredArgsConstructor
public class PointController {

    private final PointService pointService;

    @PostMapping
    public ResponseEntity<List<Point>> addPoints(@RequestBody PointDTO dto) {
        List<Point> savedPoints = pointService.addPointsBatch(
                dto.getX(),
                dto.getY(),
                dto.getZ(),
                dto.getR()
        );
        return ResponseEntity.ok(savedPoints);
    }

    @GetMapping
    public ResponseEntity<List<Point>> getPoints() {
        return ResponseEntity.ok(pointService.getAllPoints());
    }

    @DeleteMapping
    public ResponseEntity<Void> clearPoints() {
        pointService.clearPoints();
        return ResponseEntity.ok().build();
    }
}