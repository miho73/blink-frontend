import React from "react";
import {Link} from "react-router-dom";

interface ButtonProps {
  children?: React.ReactElement | string;
  onClick?: () => void;
  to?: string

  disabled?: boolean;
  className?: string;
  color?: 'default';
  size?: 'lg' | 'md' | 'sm' | 'custom';
  target?: '_blank' | '_self' | '_parent' | '_top';
}

const buttonColors: { default: string } = {
  default: 'bg-transparent border-neutral-300 text-neutral-900 hover:bg-neutral-200 hover:border-neutral-300 hover:text-black ' +
    'dark:border-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:border-neutral-700 dark:hover:text-neutral-200 ' +
    'disabled:bg-neutral-200 disabled:dark:bg-neutral-800 disabled:dark:text-neutral-200'
};

function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={
        'border rounded-xl transition ' +
        (props.size === 'lg' ? 'px-8 py-4 text-lg ' : '') +
        (props.size === 'sm' ? 'px-5 py-2 text-sm ' : '') +
        (props.size === 'md' || !props.size ? 'px-5 py-3 ' : '') +
        buttonColors[props.color ? props.color : 'default'] +
        (props.className ? ' ' + props.className : '')
      }
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

function ButtonLink(props: ButtonProps) {
  if (props.disabled) {
    return (
      <p
        className={
          'border rounded-xl bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 transition cursor-default ' +
          (props.size === 'lg' ? 'px-8 py-4 text-lg ' : '') +
          (props.size === 'sm' ? 'px-5 py-2 text-sm ' : '') +
          (props.size === 'md' || !props.size ? 'px-5 py-3 ' : '') +
          buttonColors[props.color ? props.color : 'default'] +
          (props.className ? ' ' + props.className : '')
        }
      >
        {props.children}
      </p>
    )
  }

  return (
    <Link
      to={props.to ? props.to : '#'}
      className={
        'border rounded-xl transition block w-fit ' +
        (props.size === 'lg' ? 'px-8 py-4 text-lg ' : '') +
        (props.size === 'sm' ? 'px-5 py-2 text-sm ' : '') +
        (props.size === 'md' || !props.size ? 'px-5 py-3 ' : '') +
        buttonColors[props.color ? props.color : 'default'] +
        (props.className ? ' ' + props.className : '')
      }
      target={props.target ? props.target : '_self'}
    >
      {props.children}
    </Link>
  );
}

function LinkButton(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={
        'border-none outline-none ' +
        (props.className ? ' ' + props.className : '')
      }
      disabled={props.disabled}
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
