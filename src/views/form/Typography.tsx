import {ReactNode} from "react";

interface TypographyProps {
  children: ReactNode | string | number | null;

  className?: string;
}

function Caption(props: TypographyProps) {
  return (
    <p
      className={
        'text-sm text-caption dark:text-caption-dark my-1' +
        (props.className ? ` ${props.className}` : '')
      }
    >
      {props.children}
    </p>
  );
}

export {
  Caption
}
