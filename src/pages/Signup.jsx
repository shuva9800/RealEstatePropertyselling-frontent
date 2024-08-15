import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Oauth from '../components/Oauth';
import { useSelector, useDispatch } from 'react-redux'
import { signInFalior, signInStart, signInSuccess } from '../redux/user/userSlice';
const baseUrl = import.meta.env.VITE_BASE_URL

export default function Signup() {
  const [formData , SetFormData] = useState({ });

  const { loading , error} = useSelector((state)=> state.user);


  const dispatch = useDispatch()

  const navigate =useNavigate();

  function changeHandler(event){
    SetFormData({
      ...formData,
      [event.target.id] : event.target.value,
    });
  };
  

  async function submitHandler(event){
    event.preventDefault();
    dispatch(signInStart());
    const response = await fetch(`${baseUrl}/signup`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',

        },
        body: JSON.stringify(formData),

      },
    );

    const data = await response.json();
    if(data.success === false){
    
      dispatch(signInFalior(data.message));
      return;
    }
    dispatch(signInSuccess(data.user))
    navigate("/login");
    console.log(data)

  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'> Sign Up</h1>
      <form className='flex flex-col gap-4' onSubmit={submitHandler}>
        <input type='text' placeholder='username' className='p-3 border rounded-lg' id='username' onChange={changeHandler}/>
        <input type='email' placeholder='email' className='p-3 border rounded-lg' id='email' onChange={changeHandler}/>
        <input type='password' placeholder='password' className='p-3 border rounded-lg' id='password' onChange={changeHandler}/>
        <button disabled={loading} className='p-3 text-white bg-slate-700 rounded-lg uppercase hover:opacity-95 disabled:bg-opacity-80'>
        {
          loading? 'Loading...' : 'Sign Up'
        }
        </button>
        <Oauth/>
      </form>
      <div className='flex gap-2 mt-5'>
        <p>Have an account?</p>
        <Link to='/login'>
          <span className='text-blue-700'>Login</span>
        </Link>
      </div>
      <div>
        {error && (<span className="text-red-600 mt-5">
          {error}
        </span>)}
      </div>
    </div>
  )
}
