import React from "react";
import "./switch-content.scss";

export class SwitchContent extends React.Component<{current: number}, {}> {

    public render() {

        const children = React.Children.map(this.props.children, (child, i) => {
            const hide = (i !== this.props.current) ? "hide" : "";

            return (
                <div className={"switch-content__switch-element " + hide}>
                    {child}
                </div>
            );
        });

        return (
            <div className="switch-content">
                {children}
            </div>
        );
    }

}
