import React from "react";
import { useState } from "react";
import smile from "../../assets/icons/smile1.svg";
import image from "../../assets/icons/send4.svg";

const Footer = props => {

  return (
    <div className="footer">
      <img alt={""} src={smile} style={{ width: 30, height: 30 }} />
      <input
        onKeyPress={props.onPress}
        value={props.value}
        onChange={props.onChange}
        placeholder="Write a message..."
        className="input-send"
      />
      <img onClick={(e)=>props.onPress(e)} alt={""} src={image} style={{ width: 30, height: 30, cursor: 'pointer' }} />
    </div>
  );
};
export default Footer;
