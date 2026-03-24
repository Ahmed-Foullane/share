package net.ahmed.youshar.post.exception;

public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String resource, Integer id) {
        super(resource + " with id " + id + " not found");
    }
}
