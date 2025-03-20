import { Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./pages/home/HomePage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import LoginPage from "./pages/auth/login/LoginPage";
import Sidebar from "./components/common/Sidebar";
import ProfilePage from "./pages/profile/ProfilePage";
import RightPanel from "./components/common/RightPanel";
import Notification from "./pages/notification/NotificationPage";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import API_URL from "./config/data"
import LoadingSpinner from "./components/common/LoadingSpinner";









function App() {
 

  const {data:authUser, isLoading}=useQuery({
    queryKey:["authUser"],
    queryFn: async()=>{
      try {
        const res = await  fetch(`${API_URL}/api/auth/get-user`,{
          method: 'GET',
    credentials: 'include',
        })
        
       
        const data = await res.json();
        if(data.error) return null;
        if(!res.ok){
          throw new Error(data.message)

        }
        return data;
      } catch (error) {
        throw new Error(error);
        
      }
    },
    retry:false,
  });

if(isLoading){
  return (
    <div className="h-screen flex justify-center items-center">
      <LoadingSpinner size="lg"/>
    </div>
  )
}


  return (
    <div className='flex max-w-6xl mx-auto'>
     
      {authUser &&  <Sidebar/>}
      <Routes>
      
        <Route path='/' element={authUser?<HomePage />: <Navigate to="/login"/>} />
        <Route path='/notification' element={authUser?<Notification />: <Navigate to="/login"/>} />
        <Route path='/profile/:username' element={authUser?<ProfilePage />: <Navigate to="/login"/>} />
        

        <Route path='/signup' element={!authUser?<SignUpPage />:<Navigate to="/"/>} />
        <Route path='/login' element={!authUser?<LoginPage />:<Navigate to="/"/>} />
        
      </Routes>
      {authUser && <RightPanel/>}
      <Toaster />
      
    </div>
      )
}

      export default App
