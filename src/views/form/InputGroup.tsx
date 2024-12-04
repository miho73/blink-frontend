import {ReactNode} from "react";

interface InputGroupProps {
  children?: ReactNode;
  className?: string;
}

function InputGroup(props: InputGroupProps) {
  return (
    <div className={'rounded-none input-group'}>
      {props.children}
    </div>
  )
}

export default InputGroup;
