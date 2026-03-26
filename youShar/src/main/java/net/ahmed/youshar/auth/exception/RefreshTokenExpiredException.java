package net.ahmed.youshar.auth.exception;

public class RefreshTokenExpiredException extends RuntimeException {
    public RefreshTokenExpiredException() {
        super("Refresh token has expired. Please sign in again.");
    }
}
