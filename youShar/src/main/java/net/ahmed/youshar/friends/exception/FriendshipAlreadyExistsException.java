package net.ahmed.youshar.friends.exception;

public class FriendshipAlreadyExistsException extends RuntimeException {
    public FriendshipAlreadyExistsException(Long userId, Long friendId) {
        super("Friendship between user " + userId + " and user " + friendId + " already exists");
    }
}
