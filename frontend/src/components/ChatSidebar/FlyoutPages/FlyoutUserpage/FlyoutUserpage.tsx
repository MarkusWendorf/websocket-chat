import React, {useContext} from "react";
import UserIcon from "../../../../icons/UserIcon";
import {StateContext} from "../../../../context/StateContext";
import "./flyout-userpage.scss";

const FlyoutUserpage = (props: {}) => {

    const stateContext = useContext(StateContext);

    return (
        <>
            <div className="flyout-user__icon">
                <UserIcon/>
            </div>
            <form className="flyout-user__form">
                <label className="input-with-label">
                    <input
                        type="text"
                        value={stateContext.username}
                        onChange={(e: any) => stateContext.setUsername(e.target.value)}
                        required
                    />
                    <div className="label-text">Username</div>
                </label>
            </form>
        </>
    );

};

export default FlyoutUserpage;
