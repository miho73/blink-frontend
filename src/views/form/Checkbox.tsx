import Stack from "../layout/Stack.tsx";

interface CheckboxProps {
  id?: string
  label?: string | number;
  checked?: boolean;
  setter?: (checked: boolean) => void;
  invalid?: boolean;
  className?: string;
}

function Checkbox(props: CheckboxProps) {
  return (
    <Stack direction={'row'} className={'gap-2 my-2' + (props.className ? ' ' + props.className : '')}>
      <label htmlFor={props.id} className={'cursor-pointer checkbox-cover'}>
        <input
          id={props.id}
          type={'checkbox'}
          checked={props.checked}
          className={'cursor-pointer'}
          onChange={e => props.setter?.(e.target.checked)}
        />

        <span className={'ml-2'}>{props.label}</span>
      </label>
    </Stack>
  )
}

function RadioButton(props: CheckboxProps) {
  return (
    <Stack direction={'row'} className={'gap-2 my-2'}>
      <label htmlFor={props.id} className={'cursor-pointer'}>
        <input
          id={props.id}
          type={'radio'}
          checked={props.checked}
          className={'cursor-pointer'}
          onChange={e => props.setter?.(e.target.checked)}
        />
        <span className={'ml-2'}>{props.label}</span>
      </label>
    </Stack>
  )
}

export {
  Checkbox,
  RadioButton
}
