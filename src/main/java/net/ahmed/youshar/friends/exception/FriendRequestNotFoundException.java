package net.ahmed.youshar.friends.exception;

public class FriendRequestNotFoundException extends RuntimeException {
    public FriendRequestNotFoundException(Integer id) {
        super("Friend request with id " + id + " not found");
    }
}
