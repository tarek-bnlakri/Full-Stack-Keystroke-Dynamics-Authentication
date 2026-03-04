import './App.css'
import Login from './routes/Login/Login'
import Register from './routes/Register/Register'
import HomePage from './routes/HomePage/HomePage'
import { AuthLayout } from './routes/layout/Layout'
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout/>,
      children:[
        {path:"/home",element:<HomePage/>}
        
      ]
      
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/register",
      element: <Register />
    }
  ])

  return (
    <RouterProvider router={router} />
  )
}

export default App;