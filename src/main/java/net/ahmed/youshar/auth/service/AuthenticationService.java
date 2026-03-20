package net.ahmed.youshar.auth.service;

import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.auth.entity.RefreshToken;
import net.ahmed.youshar.auth.exception.EmailAlreadyRegisteredException;
import net.ahmed.youshar.auth.exception.RefreshTokenExpiredException;
import net.ahmed.youshar.auth.exception.RefreshTokenNotFoundException;
import net.ahmed.youshar.auth.exception.UserNotFoundException;
import net.ahmed.youshar.auth.repository.RefreshTokenRepository;
import net.ahmed.youshar.user.DTO.LoginUserDto;
import net.ahmed.youshar.user.DTO.RegisterUserDto;
import net.ahmed.youshar.user.entity.AppUser;
import net.ahmed.youshar.user.entity.enume.Role;
import net.ahmed.youshar.user.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    public AppUser signup(RegisterUserDto input) {
        if (userRepository.findUserByEmailContainingIgnoreCase(input.email()).isPresent()) {
            throw new EmailAlreadyRegisteredException(input.email());
        }



        AppUser user = AppUser.builder()
                .firstName(input.firstName())
                .lastName(input.lastName())
                .email(input.email())
                .password(passwordEncoder.encode(input.password()))
                .role(Role.YOUCODE_STUDENT)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        return userRepository.save(user);
    }

    public AppUser authenticate(LoginUserDto input) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        input.email(),
                        input.password()
                )
        );

        return userRepository.findUserByEmailContainingIgnoreCase(input.email())
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + input.email()));
    }

    @Transactional
    public RefreshToken createRefreshToken(Long userId) {
        AppUser user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User with id " + userId + " not found"));

        // Delete existing refresh token for this user
        refreshTokenRepository.deleteByUser(user);

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(jwtService.getRefreshExpirationTime()))
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(token)
                .orElseThrow(RefreshTokenNotFoundException::new);

        if (refreshToken.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(refreshToken);
            throw new RefreshTokenExpiredException();
        }

        return refreshToken;
    }

    @Transactional
    public String refreshToken(String refreshToken) {
        RefreshToken token = verifyRefreshToken(refreshToken);
        UserDetails userDetails = userDetailsService.loadUserByUsername(token.getUser().getEmail());
        return jwtService.generateToken(userDetails);
    }

    @Transactional
    public void logout(String refreshToken) {
        RefreshToken token = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(RefreshTokenNotFoundException::new);
        refreshTokenRepository.delete(token);
    }
}
