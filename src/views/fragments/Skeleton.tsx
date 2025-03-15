import {ReactNode} from "react";

function SkeletonFrame(
  {children}: { children: ReactNode }
) {
  return (
    <div role="status" className="w-full animate-pulse">{children}<span className="sr-only">로딩중</span></div>
  );
}

function SkeletonElement(
  {expW, expH, className} : { expW?: number | string, expH?: number | string, className?: string }
) {
  return (
    <div
      className={'bg-neutral-200 dark:bg-neutral-700' + (className ? ' ' + className : '')}
      style={{
        width: expW,
        height: expH
      }}
    />
  )
}

export {
  SkeletonElement,
  SkeletonFrame
}
