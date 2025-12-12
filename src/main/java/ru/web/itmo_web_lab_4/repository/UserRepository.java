package ru.web.itmo_web_lab_4.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import ru.web.itmo_web_lab_4.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}