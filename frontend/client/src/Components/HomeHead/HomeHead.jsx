import {useContext} from 'react'
import { apiRequest } from '../../lib/apiRequest'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'

function HomeHead() {
    const navigate = useNavigate()
    const {currentUser}=useContext(AuthContext)

    const logout=async()=>{
            const res = await apiRequest.post('/auth/logout')
            localStorage.removeItem('user');

            if(res.status ===200)
                navigate('/login')
    }
  return (
    <div>
        <h1>Hello {currentUser.username} ...</h1>
        <button onClick={logout}>logout</button>
    </div>
  )
}

export default HomeHead