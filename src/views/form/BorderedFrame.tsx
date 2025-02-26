import {ReactNode} from "react";

function BorderedFrame(
  {title, children, className}:
  { children: ReactNode, title: string, className?: string }
) {
  return (
    <div className={'border px-4 py-4 relative mt-3' + (className ? ' ' + className : '')}>
      <p className={'absolute left-2 -top-3 bg-inherit'}>{title}</p>
      {children}
    </div>
  )
}

export default BorderedFrame;
