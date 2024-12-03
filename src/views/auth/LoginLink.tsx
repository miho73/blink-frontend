import React from "react";
import {Link} from "react-router-dom";

interface LoginLinkProps {
  img: React.ReactElement;
  text: string;
  to?: string
  onClick?: () => void;
  useLink?: boolean;
}

function LoginLink(props: LoginLinkProps) {
  if (props.useLink) {
    return (
      <Link
        className={
          'relative px-4 py-2 ' +
          'border rounded-lg flex justify-center items-center h-[50px] transition-colors ' +
          'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
        }
        to={props.to ? props.to : '/'}
      >
        <div className={'absolute left-[12px] top-[3px] w-[40px]'}>
          {props.img}
        </div>
        <p>{props.text}</p>
      </Link>
    );
  } else {
    return (
      <a
        className={
          'relative px-4 py-2 ' +
          'border rounded-lg flex justify-center items-center h-[50px] transition-colors ' +
          'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
        }
        href={props.to}
      >
        <div className={'absolute left-[12px] top-[3px] w-[40px]'}>
          {props.img}
        </div>
        <p>{props.text}</p>
      </a>
    );
  }
}

export default LoginLink;
