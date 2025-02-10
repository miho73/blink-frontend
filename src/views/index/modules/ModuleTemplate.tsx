import {ReactNode} from "react";

function ModuleTemplate(
  props: {
    children?: ReactNode,
    name: string
  }
) {
  return (
    <div className={'px-4 py-2 rounded-sm border'}>
      <p className={'text-lg font-medium mb-2'}>{props.name}</p>
      {props.children}
    </div>
  )
}

export default ModuleTemplate;
