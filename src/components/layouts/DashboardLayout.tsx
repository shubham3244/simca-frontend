import { Outlet } from "react-router-dom"

const DashboardLayout =   () =>{
    return(
    <>
<div>
    <header>
        Simca Dashboard
    </header>
    <main>
    <Outlet/>
    </main>

</div>

    </>)
}
export default DashboardLayout