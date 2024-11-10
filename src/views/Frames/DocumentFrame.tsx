import {ReactElement} from "react";

function DocumentFrame(props: {children?: ReactElement | string, className?: string}) {
  return (
    <div className={'w-full sm:w-3/4 lg:w-1/2 mx-auto px-5' + (props.className ? ' ' + props.className : '')}>
      {props.children}
    </div>
  );
}

export default DocumentFrame;
