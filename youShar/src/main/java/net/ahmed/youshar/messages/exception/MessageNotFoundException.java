package net.ahmed.youshar.messages.exception;

public class MessageNotFoundException extends RuntimeException {
    public MessageNotFoundException(Integer id) {
        super("Message with id " + id + " not found");
    }
}
