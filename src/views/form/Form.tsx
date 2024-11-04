import Stack from "../layout/Stack.tsx";
import React from "react";

interface FormGroupProps {
  label: string;
  children: React.ReactNode;
}

interface FormSectionProps {
  title: string
  children: React.ReactNode
}

function FormSection(props: FormSectionProps) {
  return (
    <Stack>
      <p className={'text-xl font-medium mb-2'}>{props.title}</p>
      {props.children}
    </Stack>
  )
}

function FormGroup(props: FormGroupProps) {
  return (
    <div className={'flex flex-col justify-start my-2'}>
      <p className={'mb-3'}>{props.label}</p>
      {props.children}
    </div>
  )
}

export {
  FormGroup,
  FormSection
}
