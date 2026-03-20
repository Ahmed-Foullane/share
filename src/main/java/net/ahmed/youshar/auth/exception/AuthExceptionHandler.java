package net.ahmed.youshar.auth.exception;

import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AuthExceptionHandler {

    @ExceptionHandler(EmailAlreadyRegisteredException.class)
    public ResponseEntity<ResponseMessage> handleEmailAlreadyRegistered(EmailAlreadyRegisteredException ex) {
        return buildResponse(HttpStatus.CONFLICT, "Email Conflict", ex.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ResponseMessage> handleUserNotFound(UserNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "User Not Found", ex.getMessage());
    }

    @ExceptionHandler(RefreshTokenNotFoundException.class)
    public ResponseEntity<ResponseMessage> handleRefreshTokenNotFound(RefreshTokenNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "Refresh Token Not Found", ex.getMessage());
    }

    @ExceptionHandler(RefreshTokenExpiredException.class)
    public ResponseEntity<ResponseMessage> handleRefreshTokenExpired(RefreshTokenExpiredException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Refresh Token Expired", ex.getMessage());
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ResponseMessage> handleBadCredentials(BadCredentialsException ex) {
        return buildResponse(HttpStatus.UNAUTHORIZED, "Invalid Credentials", "Email or password is incorrect.");
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ResponseMessage> handleUsernameNotFound(UsernameNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "User Not Found", ex.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseMessage> handleGeneric(Exception ex) {
        return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Internal Server Error", ex.getMessage());
    }

    private ResponseEntity<ResponseMessage> buildResponse(HttpStatus status, String error, String message) {
        ResponseMessage body = new ResponseMessage(status.value(), error, message);
        return ResponseEntity.status(status).body(body);
    }
}
