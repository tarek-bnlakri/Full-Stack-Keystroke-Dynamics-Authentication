import React,{useContext} from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'

function AuthLayout() {
  const {currentUser}=useContext(AuthContext)

  return (
    
    <>
    {currentUser?
      <div className='layout'>
            <Outlet/>
     </div>:<Navigate to={'/login'}/>
    }
     </>
  )
}

export  {AuthLayout}