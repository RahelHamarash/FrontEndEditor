import React from "react"
import "./ToggleButton.css"

export const ToggleButton = props => {

    return (
        <button className="toggle-button" onClick={props.click}>
            <div className="toggle-button_line"></div>
            <div className="toggle-button_line"></div>
            <div className="toggle-button_line"></div>
        </button>
    )
}