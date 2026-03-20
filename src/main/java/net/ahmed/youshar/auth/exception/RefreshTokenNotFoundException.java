package net.ahmed.youshar.auth.exception;

public class RefreshTokenNotFoundException extends RuntimeException {
    public RefreshTokenNotFoundException() {
        super("Refresh token not found");
    }
}
