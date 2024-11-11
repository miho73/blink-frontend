import Stack from "../layout/Stack.tsx";
import React, {ReactNode} from "react";

interface FormGroupProps {
  label: string;
  sidecar?: ReactNode;
  children: React.ReactNode;
  strong?: boolean
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

function FormSection(props: FormSectionProps) {
  return (
    <Stack>
      <p className={'text-xl font-bold mb-2'}>{props.title}</p>
      {props.children}
    </Stack>
  )
}

function FormGroup(props: FormGroupProps) {
  return (
    <div className={'flex flex-col justify-start my-2'}>
      {props.sidecar &&
        <div className={'flex justify-start items-center gap-3 mb-3'}>
          <p className={props.strong ? 'text-lg font-medium' : ''}>{props.label}</p>
          {props.sidecar}
        </div>
      }
      {!props.sidecar &&
        <p className={'mb-3' + (props.strong ? ' text-lg font-medium' : '')}>{props.label}</p>
      }
      {props.children}
    </div>
  )
}

export {
  FormGroup,
  FormSection
}
