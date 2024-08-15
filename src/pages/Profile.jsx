import React, { useEffect, useRef, useState} from 'react'
import {Link, useNavigate, useParams} from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { deleteUserStart, deleteUserSuccessful, deleteUserfaliors, updateUserStart,updateUserSuccess,updateUserFailure, signoutFaliors, signInStart, signoutSuccessful } from '../redux/user/userSlice';
import { app } from '../firebase';
import { toast } from 'react-toastify';
import axios from 'axios';
const baseUrl = import.meta.env.VITE_BASE_URL


export default function Profile() {
 const  data = useRef();
 
   const {currentUser,loading,error} = useSelector((state)=> state.user);
   const dispatch = useDispatch();
   const fileRef = useRef(null);
   const [file , setFile] = useState(undefined);
   //for see the uploading percentage
   const [filePerc, setFilePerc] = useState(0);
   //for file upload error porpuse
   const [fileUploadError, setFileUploadError] = useState(false);
   //from data porpuse
   const [formData, setFormData] =useState({ });
   const navigate = useNavigate()
   //error for show listing
   const [showListingerror , setshowListingerror]= useState(false);
   const [userListing, setUserListing]= useState([]);



   //image upload in fire base
  useEffect(()=>{
    if(file){
      handelFileUpload(file)
    }
  },[file]);

  const handelFileUpload =(file)=>{
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef,file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(Math.round(progress))
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  

   function changeHandler(event) {
    setFormData({
      ...formData,
      [event.target.id] : event.target.value,
    });
   }

   //form submit
  async function submitHandler(event){
    event.preventDefault();
    try{
      //set loading true
      dispatch(updateUserStart());
    const response = await fetch(`${baseUrl}/updateprofile/${currentUser._id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',

        },
        credentials: 'include',
        body: JSON.stringify(formData),

      },
    );

    const data = await response.json();
      if(data.success === false){
      
      dispatch(updateUserFailure(data.message));
      return;
   
    }
    dispatch(updateUserSuccess(data.data));
    toast.success("update success")
    }
    catch(error){
      dispatch(updateUserFailure(error.message));
      return;
    }
   }
   //profile delete
  async function profileDelete(){
    try{
      dispatch(deleteUserStart());
      const response = await fetch(`${baseUrl}/delete/${currentUser._id}`,
        
      {
        credentials: 'include',
        method: 'DELETE',
      },
      
    );

   
    const data = response.json();
    console.log("delete account",data)
    if(data.success == false){
      dispatch(deleteUserfaliors(data.message));
      return;
    }
    dispatch(deleteUserSuccessful(data.data));
    toast.error("Delete user successfully")
    navigate('/signup');

    }
    catch(error){
      console.log(error);
      dispatch(deleteUserfaliors(error.message))
    }
  }
//signout

const handelSignout = async ()=>{
  try{
    dispatch(signInStart());
    const res = await fetch(`${baseUrl}/signout`);
    const data =await res.json();
    console.log("signout function", data)
    if(data.success === false ){
      dispatch(signoutFaliors(data.message));
      return;
    }
    dispatch(signoutSuccessful(data));
    navigate('/login');
  }
  catch(error){
    dispatch(signoutFaliors(error.message));
  }
}

//for show listing
const handelShowListing = async ()=>{
  try{
    setshowListingerror(false);
    const response = await axios.get(`${baseUrl}/getlisting/${currentUser._id}`,{withCredentials: true});
    const data = response.data;
   setUserListing(data)
  }
  catch(error){
    setshowListingerror(true);
  }
}

//delete listing 
const deletelistingHandler = async (listingId) =>{
  try{
    const response = await axios.delete(`${baseUrl}/listing/delete/${listingId}`,{  withCredentials: true,});
    const data = response.data;
    console.log(data);
    setUserListing((prev)=> prev.filter((item)=> item._id !== listingId))
  }
  catch(error){
    console.log(error.message)
  }

}


  return (
    <div className=' max-w-lg mx-auto p-3 '>
       <h1 className='text-3xl text-center font-semibold my-7'> Profile</h1>
      
      <form className='flex flex-col gap-4 ' onSubmit={submitHandler}>
        <input type='file' ref={fileRef} hidden accept='image/*'
          onChange={(e)=>setFile(e.target.files[0])}
        />
        <img onClick={()=>fileRef.current.click()} src={formData.avatar || currentUser.avatar} className='h-24 w-24 object-cover rounded-full cursor-pointer self-center mt-2'/>
          <p className='text-center text-sm'>
            {fileUploadError?(<span className='text-red-700'>Error in image uploading</span>)
              : filePerc > 0 && filePerc <100 ? (<span className='text-slate-600'>{`Uploading ${filePerc}%`}</span>)
              : filePerc==100 ? (<span className='text-green-700'>File upload successfully</span>)
              : <span></span>
            }
          </p>
        <input type='text' placeholder="Username"className='p-3 border rounded-lg' id='username' defaultValue={currentUser.userName} onChange={changeHandler} />
        <input type='email' placeholder='email' className='p-3 border rounded-lg' id='email' defaultValue={currentUser.email}  onChange={changeHandler}/>
        <input type='password' placeholder='password' className='p-3 border rounded-lg' id='password' onChange={changeHandler}/>
        <button disabled={loading} className='p-3 text-white bg-slate-700 rounded-lg uppercase hover:opacity-95 disabled:bg-opacity-80'>
        {
          loading? 'Updating...' : 'Update'
        }
        </button> 
        <Link to='/create-listing' className='bg-green-700 p-3 rounded-lg uppercase text-center hover:opacity-90 text-white'>Create Listing</Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={profileDelete} className='text-red-700 cursor-pointer '>Delete account</span>
        <span onClick={handelSignout} className='text-red-700 cursor-pointer '>Sign out</span>
      </div>
      <div>
        {error && (<span className="text-red-600 mt-5">
          {error}
        </span>)}
      </div>
      <button onClick={handelShowListing} className='text-green-700 w-full '>Show Listing</button>
      <p className='text-red-700 mt-5 text-sm'>{showListingerror? ("error occure in show liisting"):""}</p>
      {userListing && userListing.length > 0 && 
        <div className='flex flex-col gap-4'>
          <p className='text-center text-2xl'>Your Listing</p>
          {
              userListing.map((list)=>(<div key={list._id} className='flex border border-gray-700 w-full justify-between items-center p-3 rounded-lg gap-4'>
              <Link to={`/listing/${list._id}`}>
              <img src={list.imageUrls[0]} className='w-16 h-16 object-contain '/>
              </Link>
              <Link to={`/listing/${list._id}`}>
              <p className='text-slate-600 hover:underline font-semibold truncate flex-1'>{list.name}</p>
              </Link>
      
              <div className='flex flex-col gap-2'>
                <button className='text-red-700 uppercase' onClick={()=>deletelistingHandler(list._id)}>Delete</button>
                <Link to={`/update-listing/${list._id}`}>
                  <button className='text-green-700 uppercase'>edit</button>
                </Link>
            
              </div>
            </div>))
          }
        </div>
      
      }
     
    </div>
  )
}
