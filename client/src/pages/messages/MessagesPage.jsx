import { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import messageService from '../../services/messageService';
import userService from '../../services/userService';

const MessagesPage = () => {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const userIdFromUrl = searchParams.get('user');

  const [conversations, setConversations] = useState([]);
  const [selectedPeerStudentId, setSelectedPeerStudentId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const myStudentId = currentUser?.studentId;

  const [studentIdByUserId, setStudentIdByUserId] = useState(() => new Map());
  const userIdByStudentId = useMemo(() => {
    const m = new Map();
    studentIdByUserId.forEach((sid, uid) => m.set(sid, uid));
    if (currentUser?.id != null && myStudentId != null) {
      m.set(myStudentId, currentUser.id);
    }
    return m;
  }, [studentIdByUserId, currentUser?.id, myStudentId]);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!myStudentId) return;
      try {
        setIsLoading(true);
        const [userMessages, allUsers] = await Promise.all([
          messageService.getUserMessages(myStudentId),
          userService.getAllUsers(),
        ]);

        const filtered = allUsers.filter((u) => u.id !== currentUser.id);
        setUsers(filtered);

        const sidMap = new Map();
        await Promise.all(
          filtered.map(async (u) => {
            try {
              const sid = await userService.getStudentIdForUser(u.id);
              if (sid != null) sidMap.set(u.id, sid);
            } catch {
            }
          })
        );
        if (currentUser?.id != null && myStudentId != null) {
          sidMap.set(currentUser.id, myStudentId);
        }
        setStudentIdByUserId(sidMap);

        const conversationMap = new Map();
        userMessages.forEach((msg) => {
          const otherStudentId = msg.senderId === myStudentId ? msg.receiverId : msg.senderId;
          if (!conversationMap.has(otherStudentId)) {
            conversationMap.set(otherStudentId, { peerStudentId: otherStudentId, lastMessage: msg });
          }
        });
        setConversations(Array.from(conversationMap.values()));
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [currentUser, myStudentId]);

  useEffect(() => {
    if (!userIdFromUrl || studentIdByUserId.size === 0) return;
    const uid = parseInt(userIdFromUrl, 10);
    if (Number.isNaN(uid)) return;
    const sid = studentIdByUserId.get(uid);
    if (sid != null) setSelectedPeerStudentId(sid);
  }, [userIdFromUrl, studentIdByUserId]);

  useEffect(() => {
    const fetchConversation = async () => {
      if (!selectedPeerStudentId || !myStudentId) return;
      try {
        const data = await messageService.getConversation(myStudentId, selectedPeerStudentId);
        setMessages(data);

        const unread = data.filter((m) => m.receiverId === myStudentId && !m.isRead);
        for (const msg of unread) {
          await messageService.markAsRead(msg.id);
        }
      } catch (err) {
        console.error('Error fetching conversation:', err);
      }
    };

    fetchConversation();
    const interval = setInterval(fetchConversation, 5000);
    return () => clearInterval(interval);
  }, [selectedPeerStudentId, myStudentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedPeerStudentId || !myStudentId) return;

    try {
      setIsSending(true);
      const sentMessage = await messageService.sendMessage(
        myStudentId,
        newMessage,
        selectedPeerStudentId
      );
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setIsSending(false);
    }
  };

  const selectPeerByStudentId = (peerStudentId) => {
    setSelectedPeerStudentId(peerStudentId);
  };

  const selectPeerByUserId = async (appUserId) => {
    let sid = studentIdByUserId.get(appUserId);
    if (sid == null) {
      try {
        sid = await userService.getStudentIdForUser(appUserId);
        if (sid != null) {
          setStudentIdByUserId((prev) => new Map(prev).set(appUserId, sid));
        }
      } catch {
        sid = null;
      }
    }
    if (sid != null) setSelectedPeerStudentId(sid);
  };

  const getUserName = (peerStudentId) => {
    const appUserId = userIdByStudentId.get(peerStudentId);
    const user = appUserId != null ? users.find((u) => u.id === appUserId) : null;
    if (user) {
      const firstName = user.firstName || user.first_name || '';
      const lastName = user.lastName || user.last_name || '';
      return `${firstName} ${lastName}`.trim() || user.email;
    }
    return `User #${peerStudentId}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg font-medium text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-0 h-[calc(100vh-12rem)]">
      <div className="w-full md:w-80 bg-gray-800 border border-gray-700 rounded-l-lg overflow-y-auto">
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-bold text-white">Messages</h2>
        </div>

        {users.length > 0 && conversations.length === 0 && !selectedPeerStudentId && (
          <div className="p-4 border-b border-gray-700">
            <p className="text-gray-400 text-sm mb-2">Start a conversation:</p>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {users.slice(0, 10).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => selectPeerByUserId(user.id)}
                  className="w-full text-left px-3 py-2 bg-gray-700 text-gray-300 rounded hover:bg-gray-600 text-sm"
                >
                  {`${user.firstName || user.first_name || ''} ${user.lastName || user.last_name || ''}`.trim() ||
                    user.email}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="divide-y divide-gray-700">
          {conversations.map((conv) => (
            <button
              key={conv.peerStudentId}
              type="button"
              onClick={() => selectPeerByStudentId(conv.peerStudentId)}
              className={`w-full text-left p-4 hover:bg-gray-700 transition-colors ${
                selectedPeerStudentId === conv.peerStudentId ? 'bg-gray-700' : ''
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                  {getUserName(conv.peerStudentId).charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{getUserName(conv.peerStudentId)}</p>
                  <p className="text-gray-400 text-sm truncate">{conv.lastMessage?.content}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 bg-gray-800 border border-gray-700 border-l-0 rounded-r-lg flex flex-col">
        {selectedPeerStudentId ? (
          <>
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white mr-3">
                  {getUserName(selectedPeerStudentId).charAt(0).toUpperCase()}
                </div>
                <h3 className="text-white font-medium">{getUserName(selectedPeerStudentId)}</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 py-8">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isOwn = msg.senderId === myStudentId;
                  return (
                    <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200'
                        }`}
                      >
                        <p className="break-words">{msg.content}</p>
                        <div className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                          {msg.isRead && isOwn && <span className="mr-1">Read</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-gray-700">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={isSending || !newMessage.trim()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto mb-4 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg mb-2">Select a conversation</p>
              <p className="text-sm">Choose a user from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
