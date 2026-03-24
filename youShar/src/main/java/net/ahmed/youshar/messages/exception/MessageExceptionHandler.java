package net.ahmed.youshar.messages.exception;

import net.ahmed.youshar.utils.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class MessageExceptionHandler {

    @ExceptionHandler(MessageNotFoundException.class)
    public ResponseEntity<ResponseMessage> handleMessageNotFound(MessageNotFoundException ex) {
        return buildResponse(HttpStatus.NOT_FOUND, "Not Found", ex.getMessage());
    }

    private ResponseEntity<ResponseMessage> buildResponse(HttpStatus status, String error, String message) {
        ResponseMessage body = new ResponseMessage(status.value(), error, message);
        return ResponseEntity.status(status).body(body);
    }
}
