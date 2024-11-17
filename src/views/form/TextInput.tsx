interface TextInputProps {
  type?: 'text' | 'password' | 'email' | 'number';

  value?: string;
  setter?: (value: string) => void;

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
        onChange={e => props.setter?.(e.target.value)}
        disabled={props.disabled}
        placeholder={props.placeholder}
        className={
          'transition ' +
          'border outline-none border-grey-400 shadow-blue-300 focus:border-blue-500 ' +
          'dark:bg-grey-900 dark:border-grey-700 dark:text-grey-100 dark:shadow-blue-400 dark:focus:border-blue-400 ' +
          'disabled:bg-grey-200 disabled:dark:bg-grey-800 disabled:dark:text-grey-200' +
          (props.size === 'sm' ? ' px-4 py-2 rounded-lg' : '') +
          (props.size === 'md' || !props.size ? ' px-6 py-3 text-lg rounded-xl' : '') +
          (props.size === 'lg' ? ' px-8 py-4 text-xl rounded-2xl max-md:px-6 max-md-py-3 max-md:text-lg max-md:rounded-xl' : '') +
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
