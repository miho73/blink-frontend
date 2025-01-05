import Stack from "../layout/Stack.tsx";
import React, {ReactNode} from "react";

interface FormGroupProps {
  label: string;
  sidecar?: ReactNode;
  children: React.ReactNode;
  strong?: boolean;
  className?: string
}

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  sectionClassName?: string;
}

function FormSection(props: FormSectionProps) {
  return (
    <Stack className={props.sectionClassName}>
      <p className={'text-xl font-bold' + (props.className ? ' ' + props.className : '')}>{props.title}</p>
      {props.children}
    </Stack>
  )
}

function FormGroup(props: FormGroupProps) {
  return (
    <Stack className={
      'justify-start my-2' +
      (props.className ? ' ' + props.className : '')
    }>
      {props.sidecar &&
        <div className={'flex justify-start items-center gap-3 mb-2'}>
          <p className={props.strong ? 'text-lg font-medium' : ''}>{props.label}</p>
          {props.sidecar}
        </div>
      }
      {!props.sidecar &&
        <p className={'mb-2' + (props.strong ? ' text-lg font-medium' : '')}>{props.label}</p>
      }
      {props.children}
    </Stack>
  )
}

export {
  FormGroup,
  FormSection
}
