package net.ahmed.youshar.auth.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import net.ahmed.youshar.auth.DTO.LoginResponse;
import net.ahmed.youshar.auth.DTO.RefreshTokenDto;
import net.ahmed.youshar.user.entity.AppUser;
import net.ahmed.youshar.auth.entity.RefreshToken;
import net.ahmed.youshar.auth.service.AuthenticationService;
import net.ahmed.youshar.auth.service.JwtService;
import net.ahmed.youshar.user.DTO.LoginUserDto;
import net.ahmed.youshar.user.DTO.RegisterUserDto;
import net.ahmed.youshar.utils.Validation;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final JwtService jwtService;
    private final AuthenticationService authenticationService;

    @PostMapping("/signup")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterUserDto registerUserDto, BindingResult result) {
        if (result.hasErrors()){
            return ResponseEntity.badRequest().body(Validation.getValidationErrors(result));
        }
        AppUser registeredUser = authenticationService.signup(registerUserDto);
        return ResponseEntity.ok(registeredUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@Valid @RequestBody LoginUserDto loginUserDto, BindingResult result) {
        if (result.hasErrors()){
            return ResponseEntity.badRequest().body(Validation.getValidationErrors(result));
        }
        AppUser authenticatedUser = authenticationService.authenticate(loginUserDto);

        String jwtToken = jwtService.generateToken(authenticatedUser);
        RefreshToken refreshToken = authenticationService.createRefreshToken(authenticatedUser.getId());

        LoginResponse loginResponse = LoginResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken.getToken())
                .expiresIn(jwtService.getExpirationTime())
                .build();

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@RequestBody RefreshTokenDto refreshTokenDto) {
        String refreshToken = refreshTokenDto.getRefreshToken();

        String newAccessToken = authenticationService.refreshToken(refreshToken);

        LoginResponse loginResponse = LoginResponse.builder()
                .token(newAccessToken)
                .refreshToken(refreshToken)
                .expiresIn(jwtService.getExpirationTime())
                .build();

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestBody RefreshTokenDto refreshTokenDto) {
        authenticationService.logout(refreshTokenDto.getRefreshToken());
        return ResponseEntity.ok().build();
    }





}
