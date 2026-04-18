import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "../components/layouts/AuthLayout";
import DashboardLayout from "../components/layouts/DashboardLayout";
export const router =  createBrowserRouter([
    {
        element:<AuthLayout/>,
        children:[
            {
                path:'/login',
                element:<div>Login Page</div>
            }
           
        ]
    },
     {
        element:<DashboardLayout/>,
        children:[
            {
            path:'/',
            element:<div>Dashboard Page</div>
        }
    ]
     }
])
