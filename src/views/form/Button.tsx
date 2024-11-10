import React from "react";
import {Link} from "react-router-dom";

interface ButtonProps {
  children?: React.ReactElement | string;
  onClick?: () => void;
  to?: string

  disabled?: boolean;
  className?: string;
  color?: 'default';
  size?: 'lg' | 'md' | 'sm';
}

const buttonColors: { default: string } = {
  default: 'bg-transparent border-grey-300 text-grey-900 hover:bg-grey-200 hover:border-grey-300 hover:text-black ' +
    'dark:border-grey-800 dark:text-grey-100 dark:hover:bg-grey-800 dark:hover:border-grey-700 dark:hover:text-grey-200'
};

function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={
        'border rounded-xl transition ' +
        (props.size === 'lg' ? 'px-8 py-4 text-lg' : props.size === 'sm' ? 'px-5 py-2 text-sm' : 'px-5 py-3') + ' ' +
        buttonColors[props.color ? props.color : 'default'] +
        (props.className ? ' ' + props.className : '')
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
        buttonColors[props.color ? props.color : 'default'] +
        (props.className ? ' ' + props.className : '')
      }
    >
      {props.children}
    </Link>
  )
}

function LinkButton(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={
        'border-none outline-none ' +
        (props.className ? ' ' + props.className : '')
      }
    >
      {props.children}
    </button>
  );
}

export {
  Button,
  ButtonLink,
  LinkButton
}
