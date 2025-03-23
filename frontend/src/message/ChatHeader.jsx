
import PropTypes from 'prop-types';
import { useUserProfile } from "../hooks/useUserProfile";
import { useEffect } from 'react';


const ChatHeader = ({ username }) => {
  
   
    const { data: user,  isRefetching, refetch } = useUserProfile(username);
    
    useEffect(() => {
      refetch();
    }, [username, refetch]);


    return (
        <div className="p-2.5 border-b border-base-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="avatar">
                <div className="size-10 rounded-full relative">
                  <img src={user?.profileImg || "/avatar.png"} alt={user?.name} />
                </div>
              </div>
    
              {/* User info */}
              <div>
                <h3 className="font-medium">{user?.username}</h3>
                <p className="text-sm text-base-content/70">
                  {/* {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"} */}
                </p>
              </div>
            </div>
    
            {/* Close button */}
            {/* <button onClick={() => setSelectedUser(null)}>
              <X />
            </button> */}
          </div>
        </div>
      );





}
ChatHeader.propTypes = {
  username: PropTypes.string.isRequired,
};


export default ChatHeader