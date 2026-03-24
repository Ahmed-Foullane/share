package net.ahmed.youshar.friends.exception;

import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class FriendsExceptionHandler {

    @ExceptionHandler(FriendshipNotFoundException.class)
    public ResponseEntity<ResponseMessage> handleFriendshipNotFound(FriendshipNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage());
    }

    @ExceptionHandler(FriendshipAlreadyExistsException.class)
    public ResponseEntity<ResponseMessage> handleFriendshipAlreadyExists(FriendshipAlreadyExistsException ex) {
        return buildResponse(HttpStatus.CONFLICT, "Conflict", ex.getMessage());
    }

    @ExceptionHandler(FriendRequestNotFoundException.class)
    public ResponseEntity<ResponseMessage> handleFriendRequestNotFound(FriendRequestNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage());
    }

    private ResponseEntity<ResponseMessage> buildResponse(HttpStatus status, String error, String message) {
        ResponseMessage body = new ResponseMessage(status.value(), error, message);
        return ResponseEntity.status(status).body(body);
    }
}
