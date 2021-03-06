import React, { useEffect, useState, useRef } from 'react'
import { useField } from '@unform/core'
import PropTypes from 'prop-types'
import styled from "styled-components";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 5px 0;
  position: relative;
  margin-top: 10px;
  color: #000;
  font-family: "Montserrat", sans-serif;
  border: none;

  & > input {
    border: 1px solid #2699F8;
    border-radius: 5px;
    // background-color: #FFF;
    background-color: #2699F8;
    outline: none;
    padding: 1px 0px 1px 5px;
    // padding: 8px 2px 8px 11px;
    font-size: 12px;
    // transition: all 0.2s ease;
    z-index: 500;
    height: 30px;
  }

  & > input:hover {
    border: 1px solid #0031FF;
  }

  & > label {
    color: #757575;
    // position: absolute;
    // top: 15px;
    // left: 10px;
    // transition: all 0.2s ease;
    z-index: 500;
    border: none;

    ${props =>
      props.focused && `
        font-size: 10px;
        // transform: translateY(-23px) translateX(-5px);
        z-index: 501;
        color: #757575;
        // background: #FFF;
        // padding: 0px 5px 0px 5px;
      `}
  } 
  
`;

export default function Input({ 
  name,
  label,
  type,
  onBlur,
  onFocus,
  ...rest 
}) {
  const inputRef = useRef(null)
  const { fieldName, registerField, defaultValue, error } = useField(name)
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    inputRef.current.value = defaultValue !== undefined ? defaultValue : null
  }, [defaultValue])

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
      clearValue(ref) {
        ref.value = ''
        ref.clear()
      },
      setValue(ref, value) {
        ref.setNativeProps({ text: value })
        inputRef.current.value = value
      },
      getValue(ref) {
        return ref.value
      },
    })
  }, [fieldName, registerField])

  const handleOnFocus = () => {
    setFocused(true)
    return onFocus
  }

  const handleOnBlur = () => {
    setFocused(false)
    return onBlur
  }

  console.log('**** defaultValue', defaultValue, String(defaultValue).length)
  const isFocused = focused || inputRef.current ? String(inputRef.current.value).length ? true : false : false || defaultValue ? true : false || type === "date"
  
  const renderLabel = () => label && <label>{label}</label>

  return (
    <InputContainer focused={isFocused}>
      {renderLabel()}
      <input 
        ref={inputRef} 
        type={type}
        defaultValue={defaultValue}
        placeholder={isFocused ? undefined : label}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        {...rest} 
      />
      { 
        error && <span style={{ 
          color: '#E6474D',
          fontSize: '10px',
          fontWeight: 'normal',
          marginTop: '2px',
        }}>{error}</span> 
      }
    </InputContainer>
  )
}

Input.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  type: PropTypes.string,
  inputRef: PropTypes.func,
}
