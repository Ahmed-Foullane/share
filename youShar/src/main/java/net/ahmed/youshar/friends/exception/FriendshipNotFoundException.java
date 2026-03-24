package net.ahmed.youshar.friends.exception;

public class FriendshipNotFoundException extends RuntimeException {
    public FriendshipNotFoundException(Integer id) {
        super("Friendship with id " + id + " not found");
    }
}
