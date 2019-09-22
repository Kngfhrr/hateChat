import React from "react";
import "../styles/header.css";

const Header = props => (
  <div className="header">
    <div className={"logo"}>
      <img
        src={require("../../../assets/icons/logo.svg")}
        alt={"f"}
        style={{ width: 50, height: 50 }}
      />
    </div>
    <div className={"companion"}>
      <div className={"online-status"}>
        <div
          className={"status"}
          style={{ background: !!props.active ? "#00FF09" : "#F50057" }}
        />
        <span className="your-login">
          {!!props.login ? props.login : "Anon"}
        </span>
      </div>
      <span className={"active"}>
        {!!props.active ? props.active : "offline"}
      </span>
    </div>
    <div className={"users-info"}>
      <img
        src={
          !!props.photo
            ? props.photo
            : require("../../../assets/icons/logo.svg")
        }
        className={"photo"}
      />
    </div>
  </div>
);
export default Header;
