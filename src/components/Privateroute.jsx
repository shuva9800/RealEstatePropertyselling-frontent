import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom';

export default function Privateroute() {
    const{currentUser} = useSelector((state)=> state.user);
    return currentUser?(<Outlet/>):(<Navigate to="/signup"/>)
    // if(currentUser){
    //     return Children;
    // }
    // else{
    //    return <Navigate to="/login" />
    // }
    
    
}
