import { create } from "zustand";
import axios from "axios";


const API_URL = import.meta.env.MODE === "development" ? "http://localhost:8000/api/auth" : "/api/auth";
axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    

   //sign up function
   register: async (name, username, email, password) => {
    set({ isLoading: true, error: null });

    try {
        const response = await axios.post(`${API_URL}/register`, { name, username, email, password })
        set({ user: response.data.user, isAuthenticated: true, isLoading: false })

    } catch (error) {
        set({ error: error.response.data.message || "error signing up", isLoading: false })
        throw error;
    }finally{
        set({isLoading: false})
    }
},

getuser: async()=>{
    set({ isLoading: true, error: null });

    try {
        const response = await axios.get(`${API_URL}/get-user`)
        set({ user: response.data.user, isAuthenticated: true, isLoading: false })
        
    } catch (error) {
        set({ error: error.response.data.message, isLoading: false })
        throw error;
        
    }finally{
        set({ isLoading: false});
    }

}



}));