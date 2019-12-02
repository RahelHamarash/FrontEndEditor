import React from "react" ;
import "./SideDrawer.css"
export const SideDrawer = props => {

    return (

        <nav className="side-drawer">
            <ul>
                <li><a href="/">New Notes</a></li>
                <li><a href="/">My Notes</a></li>
            </ul>
        </nav>
    )
}