import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Header from './components/Header'
import CreateListing from './pages/CreateListing'
import ListingItem from './pages/ListingItem'
import UpdateListing from './pages/UpdateListing'
import Search from './pages/Search'
// import Privateroute from './components/Privateroute'


export default function App() {
  return (
    <BrowserRouter>
    <Header/>
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/create-listing' element={<CreateListing/>}/>
      <Route path='/listing/:id' element={<ListingItem/>}/>
      <Route path='/update-listing/:listingId' element={<UpdateListing/>}/>
      <Route path='/search' element={<Search />} />

      {/* <Route element={<Privateroute/>}>
          <Route path='/profile' element={Profile}/>
      </Route> */}
      
    </Routes>
</BrowserRouter>
  )
}
