import React from 'react'
import {GoogleAuthProvider, getAuth, signInWithPopup} from 'firebase/auth'
import { app } from '../firebase';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { useNavigate } from 'react-router-dom';
const baseUrl = import.meta.env.VITE_BASE_URL

export default function Oauth() {
  const dispatch = useDispatch();
  const  navigate = useNavigate();
 async function handelGoogleClick(){
    try{
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth , provider);
      console.log("google signin result is:-", result);
      const response = await fetch(`${baseUrl}/google`,{
        method: 'POST',
        headers:{
          'content-type': 'application/json',
        },
        body: JSON.stringify({name:result.user.displayName,email:result.user.email,photo:result.user.photoURL})
      })
      const data = await response.json();
      dispatch(signInSuccess(data));
      navigate('/')
    }
    catch(error){
      console.log("error occure using signin using goole account", error)
    }
  }
  return (
    <button onClick={handelGoogleClick} type='button' className='bg-red-700 text-white rounded-lg
    uppercase hover:opacity-95 p-3'>continue with Google</button>
  )
}

