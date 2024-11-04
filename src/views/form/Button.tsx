import React from "react";
import {Link} from "react-router-dom";

interface ButtonProps {
  children?: React.ReactElement | string;
  onClick?: () => void;
  to?: string

  disabled?: boolean;
  className?: string;
  color?: 'default'
}

const buttonColors: {default: string} = {
  default: 'bg-transparent border-grey-300 text-grey-900 hover:bg-grey-200 hover:border-grey-300 hover:text-black ' +
    'dark:border-grey-800 dark:text-grey-100 dark:hover:bg-grey-800 dark:hover:border-grey-700 dark:hover:text-grey-200'
};

function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={
        'px-5 py-3 border rounded-xl transition ' +
        buttonColors[props.color ? props.color : 'default']
      }
    >
      {props.children}
    </button>
  );
}

function ButtonLink(props: ButtonProps) {
  return (
    <Link
      to={props.to ? props.to : '#'}
      className={
        'px-5 py-3 border rounded-xl transition ' +
        buttonColors[props.color ? props.color : 'default']
      }
    >
      {props.children}
    </Link>
  )
}

export {
  Button,
  ButtonLink
}
