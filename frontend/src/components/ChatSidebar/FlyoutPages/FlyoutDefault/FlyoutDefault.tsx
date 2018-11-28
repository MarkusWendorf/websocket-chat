import React from "react";
import {Link} from "react-router-dom";
import "./flyout-defaultpage.scss";

const FlyoutDefault = () => (
    <>
        <div className="flyout__chat-rooms">
            <h1>Chatrooms</h1>
            <Link to={"/chatrooms/Gaming"}>Gaming</Link>
            <Link to={"/chatrooms/Sports"}>Sports</Link>
            <Link to={"/chatrooms/Hardware"}>Hardware</Link>
            <Link to={"/chatrooms/Cooking"}>Cooking</Link>
            <Link to={"/chatrooms/Smalltalk"}>Smalltalk</Link>
        </div>

        <ul className="flyout__about">
            <h1>About</h1>
            <li>About Chatney</li>
            <li>Terms of use</li>
            <li>Privacy policy</li>
            <li>Contact</li>
        </ul>
    </>
);

export default FlyoutDefault;
