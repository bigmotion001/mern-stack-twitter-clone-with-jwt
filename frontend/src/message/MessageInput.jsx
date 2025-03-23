import { useRef, useState } from "react";

import { IoMdSend } from "react-icons/io";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import API_URL from "../config/data";



const MessageInput = () => {
    const [text, setText] = useState("");
  
  const fileInputRef = useRef(null);
 
const isLoading = false;
  

  
  
//handle send message
const handleSendMessage = async(e)=>{
    e.preventDefault();
    if(!text.trim()) return;

    try {
        
  
        // Clear form
        setText("");
        
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (error) {
        console.error("Failed to send message:", error);
      }

}



//send a message
const { mutate: sendMessage, isPending } = useMutation({
  mutationFn: async ({ text, img }) => {
    try {
      const res = await fetch(`${API_URL}/api/users/message`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, img }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      throw new Error(error);
    }
  },

  onSuccess: () => {
    // refetch the authUser
    toast.success("Post Created Successful");

    queryClient.invalidateQueries({ queryKey: ["posts"] });
    setText(" ");
    if(img)setImg(null);
  },
});









  
    return (


<div className="p-4 w-full ">
         
        

  <form onSubmit={handleSendMessage} className="flex items-center gap-2 ">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          

          
        </div>
        {isLoading? (<span className="loading loading-spinner text-primary"></span>) :(<button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() }
        >
          <IoMdSend />
        </button>)}
      </form>


        
      </div>
    );

};

export default MessageInput;