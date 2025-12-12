package ru.web.itmo_web_lab_4;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import ru.web.itmo_web_lab_4.entity.User;
import ru.web.itmo_web_lab_4.repository.UserRepository;

@SpringBootApplication
public class ItmoWebLab4Application {

	public static void main(String[] args) {
		SpringApplication.run(ItmoWebLab4Application.class, args);
	}

	@Bean
	CommandLineRunner initAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (userRepository.findByUsername("admin").isEmpty()) {
				User admin = new User();
				admin.setUsername("admin");
				admin.setPassword(passwordEncoder.encode("12345"));
				userRepository.save(admin);
			}
		};
	}
}