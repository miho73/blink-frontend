import Stack from "../layout/Stack.tsx";

interface CheckboxProps {
  id?: string
  label?: string;
  checked?: boolean;
  setter?: (checked: boolean) => void
}

function Checkbox(props: CheckboxProps) {
  return (
    <Stack direction={'row'} className={'gap-2 my-2'}>
      <input
        id={props.id}
        type={'checkbox'}
        checked={props.checked}
        className={'cursor-pointer fill-grey-800'}
      />
      <label htmlFor={props.id} className={'cursor-pointer'}>{props.label}</label>
    </Stack>
  )
}

function RadioButton(props: CheckboxProps) {
  return (
    <Stack direction={'row'} className={'gap-2 my-2'}>
      <input
        id={props.id}
        type={'radio'}
        checked={props.checked}
        className={'cursor-pointer fill-grey-800'}
      />
      <label htmlFor={props.id} className={'cursor-pointer'}>{props.label}</label>
    </Stack>
  )
}

export {
  Checkbox,
  RadioButton
}
