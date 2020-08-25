import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import styled from "styled-components"

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
  position: relative;
  margin-top: 10px;
  color: #000;
  font-family: "Montserrat", sans-serif;

  & > input {
    border: 1px solid #2699F8;
    border-radius: 0.25rem;
    background-color: #FFF;
    outline: none;
    padding: 1px 0px 1px 5px;
    font-size: 14px;
    transition: all 0.2s ease;
    z-index: 500;
    height: 30px;
    margin-buttom: 10px;
  }

  & > input:hover {
    border: 1px solid #0031FF;
  }

  & > label {
    color: #757575;
    position: absolute;
    top: 15px;
    left: 10px;
    transition: all 0.2s ease;
    z-index: 500;
    border: none;

    ${props =>
      props.focused && `
        font-size: 13px;
        transform: translateY(-23px) translateX(-5px);
        z-index: 501;
        color: #757575;
        background: #FFF;
        padding: 0px 5px 0px 5px;
      `}
  } 
  
`

export default function Input({ 
  name,
  label,
  type,
  onBlur,
  onFocus,
  ...rest 
}) {
  const inputRef = useRef(null)

  const renderLabel = () => label && <label>{label}</label>

  return (
    <InputContainer focused={true}>
      {renderLabel()}
      <input 
        ref={inputRef} 
        type={type}
        {...rest} 
      />
    </InputContainer>
  )
}

Input.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  inputRef: PropTypes.func,
}
