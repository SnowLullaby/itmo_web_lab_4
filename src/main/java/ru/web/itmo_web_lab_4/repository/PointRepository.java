package ru.web.itmo_web_lab_4.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.web.itmo_web_lab_4.entity.Point;

public interface PointRepository extends JpaRepository<Point, Long> {
}