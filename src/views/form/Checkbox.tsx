import Alert from "./Alert.tsx";

interface CheckboxProps {
  id?: string
  label?: string | number;
  checked?: boolean;
  setter?: (checked: boolean) => void;
  toggle?: () => void;
  invalid?: boolean;
  className?: string;
  error?: string;
  disabled?: boolean;
}

function Checkbox(props: CheckboxProps) {
  function onChange(flag: boolean) {
    if(props.setter) {
      props.setter(flag)
    }
    else if(props.toggle) {
      props.toggle();
    }
  }

  return (
    <div className={'my-2' + (props.className ? ' ' + props.className : '')}>
      <label htmlFor={props.id} className={'cursor-pointer checkbox-cover'}>
        <input
          id={props.id}
          type={'checkbox'}
          checked={props.checked}
          className={'cursor-pointer'}
          onChange={e => onChange(e.target.checked)}
          disabled={props.disabled}
        />

        <span className={'ml-2'}>{props.label}</span>
      </label>
      { props.invalid && <Alert variant={'error'} className={'!mb-0'}>{props.error}</Alert> }
    </div>
  )
}

function RadioButton(props: CheckboxProps) {
  return (
    <div className={'my-2' + (props.className ? ' ' + props.className : '')}>
      <label htmlFor={props.id} className={'cursor-pointer'}>
        <input
          id={props.id}
          type={'radio'}
          checked={props.checked}
          className={'cursor-pointer'}
          onChange={e => props.setter?.(e.target.checked)}
          disabled={props.disabled}
        />
        <span className={'ml-2 !mb-0'}>{props.label}</span>
      </label>
    </div>
  )
}

export {
  Checkbox,
  RadioButton
}
