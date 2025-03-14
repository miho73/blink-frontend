import {ReactNode} from "react";

function ModuleTemplate(
  props: {
    children?: ReactNode,
    name: string,
    className?: string
  }
) {
  return (
    <div className={props.className ?? ''}>
      <p className={'text-lg font-medium mb-2'}>{props.name}</p>
      <div className={'p-4 rounded-sm border'}>
        {props.children}
      </div>
    </div>
  )
}

export default ModuleTemplate;
