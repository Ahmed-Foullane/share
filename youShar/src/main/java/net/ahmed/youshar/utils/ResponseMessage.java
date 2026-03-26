    package net.ahmed.youshar.utils;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ResponseMessage {
    private int status;
    private String message;
    private String error;
    private LocalDateTime timestamp;

    public ResponseMessage(int status , String error, String message ){
        this.status = status;
        this.message = message;
        this.error = error;
        this.timestamp = LocalDateTime.now();
    }

    public ResponseMessage(int status , String message){
        this.status = status;
        this.message = message;
        this.timestamp = LocalDateTime.now();
    }

}
