import Alert from "./Alert.tsx";

interface TextInputProps {
  type?: 'text' | 'password' | 'email' | 'number';

  value?: string | number;
  setter?: ((value: number) => void) | ((value: string) => void);

  label?: string;
  placeholder?: string;

  disabled?: boolean;
  invalid?: boolean;
  error?: string
  size?: 'sm' | 'md' | 'lg';
  authComplete?: 'email' | 'nickname' | 'name' | 'username' | 'new-password' | 'current-password' | 'one-time-code';
  onEnter?: () => void;

  className?: string;
}

function TextInput(props: TextInputProps) {
  function onKeyPress(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      props.onEnter?.();
    }
  }

  function setter(val: string) {

    if(props.type === 'number') {
      // @ts-expect-error type safe
      props.setter?.(parseInt(val));
    }
    else {
      // @ts-expect-error type safe
      props.setter?.(val);
    }
  }

  return (
    <>
      <input
        type={props.type || 'text'}
        value={props.value}
        onChange={e => setter(e.target.value)}
        disabled={props.disabled}
        placeholder={props.placeholder}
        className={
          'transition ' +
          'border rounded-sm outline-none border-neutral-400 shadow-blue-300 focus:border-blue-500 ' +
          'dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-100 dark:shadow-blue-400 dark:focus:border-blue-400 ' +
          'disabled:bg-neutral-200 disabled:dark:bg-neutral-800 disabled:text-neutral-500 disabled:dark:text-neutral-400 ' +
          (props.size === 'lg' ? 'px-6 py-3 text-lg' : '') +
          (props.size === 'md' || !props.size ? 'px-4 py-2' : '') +
          (props.size === 'sm' ? 'px-3 py-2 text-sm' : '') +
          (props.className ? ' ' + props.className : '')
        }
        autoComplete={props.authComplete}
        onKeyDown={onKeyPress}
      />
      {props.invalid &&
        <Alert variant={'error'} className={'!mb-0'}>{props.error}</Alert>
      }
    </>
  );
}

function TextArea(props: TextInputProps) {
  return (
    <>
      <textarea
        value={props.value}
        // @ts-expect-error value always can be converted to string or number
        onChange={e => props.setter?.(e.target.value)}
        disabled={props.disabled}
        placeholder={props.placeholder}
        className={
          'resize-none rounded-sm min-h-[200px] transition ' +
          'border outline-none bg-transparent ' +
          'shadow-blue-300 focus:border-blue-500 dark:shadow-blue-400 dark:focus:border-blue-400 ' +
          'disabled:bg-neutral-200 disabled:dark:bg-neutral-800 disabled:text-neutral-500 disabled:dark:text-neutral-400 ' +
          (props.size === 'lg' ? 'px-6 py-3 text-lg' : '') +
          (props.size === 'md' || !props.size ? 'px-4 py-2' : '') +
          (props.size === 'sm' ? 'px-3 py-2 text-sm' : '') +
          (props.className ? ' ' + props.className : '')
        }
      />
      {props.invalid &&
        <Alert variant={'error'} className={'!mb-0'}>{props.error}</Alert>
      }
    </>
  );
}

export {
  TextInput,
  TextArea
}
