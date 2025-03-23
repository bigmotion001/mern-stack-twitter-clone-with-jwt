import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { IoMdSend } from "react-icons/io";
import ChatHeader from "./ChatHeader";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { formatMessageTime } from "../utils/date";
import { useAuthStore } from "../store/authStore";
import { useUserProfile } from "../hooks/useUserProfile";
import MessageSkeleton from "./MessageSkeleton";

const Chat = () => {
  const {
    getMessage,
    connectSocket,
    messages: authMessages,
    getReceiverId,
    sendMSG,
    subscribeToMessages,
    isLoading: isAuthLoading,
    unsubscribeToMessages,
  } = useAuthStore();

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const { username } = useParams();
  const { data: user, isRefetching, refetch } = useUserProfile(username);

  const [text, setText] = useState("");
  const messageRef = useRef(null);

  // Handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    try {
      await sendMSG({ text });
      setText(""); // Clear input after sending
    } catch (error) {
      console.error("Failed to send message:", error.message);
    }
  };

  // Refetch user profile when username changes
  useEffect(() => {
    refetch();
  }, [username, refetch]);

  // Fetch receiver ID and messages when user data is available
  useEffect(() => {
    if (user?._id) {
      getReceiverId(user._id);
      getMessage();
    }
  }, [user?._id, getReceiverId, getMessage]);

  // Connect to socket and subscribe to messages
  useEffect(() => {
    if (authUser?._id) {
      connectSocket(authUser._id);
      subscribeToMessages();
    }

    return () => {
      if (authUser?._id) {
        unsubscribeToMessages();
      }
    };
  }, [
    connectSocket,
    subscribeToMessages,
    unsubscribeToMessages,
    authUser?._id,
  ]);

  // Scroll to the latest message
  useEffect(() => {
    if (messageRef.current && authMessages?.length > 0) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [authMessages]);

  // Show loading state while refetching
  {
    isAuthLoading && isRefetching && <MessageSkeleton />;
  }

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      <ChatHeader username={user?.username} />
      <div className="p-4 rounded-md sticky top-2 mb-4">
        {authMessages?.map((message) => (
          <div
            key={message._id}
            className={`chat ${
              message.senderId === authUser._id ? "chat-end" : "chat-start"
            }`}
            ref={messageRef}
          >
            <div className="chat-header">
              {message.senderId === authUser._id
                ? authUser.username
                : user?.username}
              <time className="text-xs opacity-50">
                {formatMessageTime(message.createdAt)}
              </time>
            </div>
            <div className="chat-bubble">
              {message.text && <p>{message.text}</p>}
            </div>
            <div className="chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profileImg || "/avatar.png"
                      : user?.profileImg || "/avatar.png"
                  }
                  alt=""
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2 p-4"
      >
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() || isAuthLoading}
        >
          {isAuthLoading ? <LoadingSpinner /> : <IoMdSend />}
        </button>
      </form>
    </div>
  );
};

export default Chat;
