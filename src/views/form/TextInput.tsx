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

  return (
    <>
      <input
        type={props.type || 'text'}
        value={props.value}
        // @ts-expect-error value always can be converted to string or number
        onChange={e => props.setter?.(e.target.value)}
        disabled={props.disabled}
        placeholder={props.placeholder}
        className={
          'transition ' +
          'border outline-none border-neutral-400 shadow-blue-300 focus:border-blue-500 ' +
          'dark:bg-neutral-900 dark:border-neutral-700 dark:text-neutral-100 dark:shadow-blue-400 dark:focus:border-blue-400 ' +
          'disabled:bg-neutral-200 disabled:dark:bg-neutral-800 disabled:dark:text-neutral-200' +
          (props.size === 'sm' ? ' px-3 py-2 rounded-lg text-sm' : '') +
          (props.size === 'md' || !props.size ? ' px-4 py-2 rounded-lg' : '') +
          (props.size === 'lg' ? ' px-6 py-3 text-lg rounded-xl' : '') +
          (props.className ? ' ' + props.className : '')
        }
        autoComplete={props.authComplete}
        onKeyDown={onKeyPress}
      />
      {props.invalid &&
        <p className={'my-2 text-red-500 dark:text-red-300'}>{props.error}</p>
      }
    </>
  );
}

export {
  TextInput
}
