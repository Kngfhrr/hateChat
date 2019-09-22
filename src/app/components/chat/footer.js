import React from "react";
import { useState } from "react";
import smile from "../../../assets/images/smile1.svg";
import image from "../../../assets/images/image.svg";

const Footer = () => {
  const [message, setMessage] = useState("");
  return (
    <div className="footer">
      <div className="icons">
        <img
          style={{ width: "30px", cursor: "pointer" }}
          src={smile}
          alt={""}
        />
        <img
          style={{ width: "30px", cursor: "pointer" }}
          src={image}
          alt={""}
        />
      </div>

      <input
        onKeyPress={this.createChat}
        placeholder="Write a message..."
        className="input-send"
      />
    </div>
  );
};
export default Footer;
