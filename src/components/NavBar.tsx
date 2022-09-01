import React from "react";
import { Link , Outlet } from "react-router-dom";

const NavBar: React.FC = () => {
    return (<div className=" mx-auto max-w-[95%] sm:container">
        <nav className="flex items-center py-3 ">
            <div className=" flex items-center  bg-white flex-1 rounded-lg shadow p-2">
                <Link to="/">
                    <span className="font-mono text-xl font-bold">UPayment Store</span>
                </Link>
            </div>
        </nav>
        <Outlet/>
    </div>)
};

export default NavBar;