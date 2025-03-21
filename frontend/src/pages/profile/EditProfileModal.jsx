import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation,useQueryClient } from "@tanstack/react-query";
import API_URL from "../../config/data";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EditProfileModal = () => {
	const [formData, setFormData] = useState({
		name: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};


	const queryClient = useQueryClient();


//update profilr data
const {mutate:updateData, isPending} = useMutation({
	mutationFn: async ({name, username, email, bio, link, newPassword, currentPassword})=>{
		try {
			const res= await fetch(`${API_URL}/api/users/update`, {
				method: "POST",
				credentials: 'include',
				headers:{
					"Content-Type": "application/json",
				},
				body: JSON.stringify({name, username, email, bio, link, newPassword, currentPassword}),
			});
			const data = await res.json();
			if(!res.ok){
				
				throw new Error(data.message)
				
			}
			
			return data;
		} catch (error) {
			throw new Error(error);
		};
	},

	onSuccess: () => {
		// refetch the authUser
		toast.success("profile updated Successful")
		
		queryClient.invalidateQueries({ queryKey: ["authUser"] });
	},
	
})

const handleupdateData =(e)=>{
	e.preventDefault();
	updateData(formData);

}

	return (
		<>
			<button
				className='btn btn-outline rounded-full btn-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box border rounded-md border-gray-700 shadow-md'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={handleupdateData}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.name}
								name='name'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='flex-1 input border border-gray-700 rounded p-2 input-md'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='flex-1 input border border-gray-700 rounded p-2 input-md'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='btn btn-primary rounded-full btn-sm text-white
						'disabled={isPending}
						>
							{isPending? <LoadingSpinner/>: "Update"}
							</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;