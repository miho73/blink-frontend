import React from "react";
import {Link} from "react-router-dom";

interface ButtonProps {
  children?: React.ReactElement | string | string[];
  onClick?: () => void;
  to?: string

  disabled?: boolean;
  className?: string;
  color?: 'default' | 'accent' | 'accentLight';
  size?: 'lg' | 'md' | 'sm' | 'custom';
  target?: '_blank' | '_self' | '_parent' | '_top';
}

const buttonColors: { default: string, accent: string, accentLight: string } = {
  default: 'border bg-transparent hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800 ' +
    'shadow-blue-300 focus:border-blue-500 dark:shadow-blue-400 dark:focus:border-blue-400 ' +
    'disabled:bg-neutral-200 disabled:dark:bg-neutral-800 disabled:text-neutral-500 disabled:dark:text-neutral-400 disabled:border-none',
  accent: 'text-white bg-primary-dark hover:bg-opacity-80 focus:bg-opacity-70 dark:bg-primary-light dark:hover:bg-opacity-70 dark:focus:bg-opacity-40 ' +
    'disabled:bg-neutral-200 disabled:dark:bg-neutral-800 disabled:text-neutral-500 disabled:dark:text-neutral-400',
  accentLight: 'text-white bg-primary-dark hover:bg-opacity-80 focus:bg-opacity-70 dark:bg-primary-light dark:hover:bg-opacity-70 dark:focus:bg-opacity-40 ' +
    'disabled:bg-neutral-200 disabled:dark:bg-neutral-700 disabled:text-neutral-500 disabled:dark:text-neutral-400',
};

const textButtonColors: { default: string, accent: string, accentLight: string } = {
  default: 'focus:text-neutral-600 dark:focus:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 ' +
    'disabled:text-neutral-300 dark:disabled:text-neutral-600',
  accent: 'text-primary-dark hover:text-opacity-80 focus:text-opacity-70 dark:text-primary-white dark:hover:text-opacity-70 dark:focus:text-opacity-40 ' +
    'disabled:text-neutral-300 dark:disabled:text-neutral-600',
  accentLight: 'text-primary-dark hover:text-opacity-80 focus:text-opacity-70 dark:text-primary-white dark:hover:text-opacity-70 dark:focus:text-opacity-40 ' +
    'disabled:text-neutral-300 dark:disabled:text-neutral-600',
}

function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={
        'transition outline-none rounded-sm ' +
        (props.size === 'lg' ? 'px-6 py-3 text-lg ' : '') +
        (props.size === 'md' || !props.size ? 'px-4 py-2 ' : '') +
        (props.size === 'sm' ? 'px-3 py-2 text-sm ' : '') +
        buttonColors[props.color ? props.color : 'default'] +
        (props.className ? ' ' + props.className : '')
      }
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}

function TextButton(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      className={
        'transition outline-none ' +
        (props.size === 'lg' ? 'px-6 py-3 text-lg ' : '') +
        (props.size === 'md' || !props.size ? 'px-4 py-2 ' : '') +
        (props.size === 'sm' ? 'px-3 py-2 text-sm ' : '') +
        textButtonColors[props.color ? props.color : 'default'] +
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
          'rounded-sm border bg-neutral-200 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 cursor-default ' +
          (props.size === 'lg' ? 'px-6 py-3 text-lg ' : '') +
          (props.size === 'md' || !props.size ? 'px-4 py-2 ' : '') +
          (props.size === 'sm' ? 'px-3 py-2 text-sm ' : '') +
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
        'transition block outline-none button cursor-pointer rounded-sm ' +
        (props.size === 'lg' ? 'px-6 py-3 text-lg ' : '') +
        (props.size === 'md' || !props.size ? 'px-4 py-2 ' : '') +
        (props.size === 'sm' ? 'px-3 py-2 text-sm ' : '') +
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
        'border-none outline-none p-0 inline text-left ' +
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
  TextButton,
  ButtonLink,
  LinkButton
}
