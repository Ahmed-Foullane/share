package net.ahmed.youshar.post.exception;

import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class PostExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ResponseMessage> handleResourceNotFound(ResourceNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage());
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ResponseMessage> handleDuplicateResource(DuplicateResourceException ex) {
        return buildResponse(HttpStatus.CONFLICT, "Conflict", ex.getMessage());
    }

    private ResponseEntity<ResponseMessage> buildResponse(HttpStatus status, String error, String message) {
        ResponseMessage body = new ResponseMessage(status.value(), error, message);
        return ResponseEntity.status(status).body(body);
    }
}
