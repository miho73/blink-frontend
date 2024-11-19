import {ReactNode} from "react";

interface ToolBarInputProps {
  type?: 'text' | 'password' | 'email';
  placeholder?: string;
  label?: string;
  value?: string;
  setter?: (value: string) => void;
  className?: string;
  onEnter?: () => void;
  onMetaEnter?: () => void;
  onCtrlEnter?: () => void;
}

interface ToolBarButtonProps {
  onClick: () => void;
  children: ReactNode;
  className?: string;
}

function ToolBarInput(props: ToolBarInputProps) {
  return (
    <input
      type={props.type ?? 'text'}
      placeholder={props.placeholder}
      value={props.value}
      onChange={e => props.setter?.(e.target.value)}
      className={
        'px-2 py-1 border-r border-grey-400 dark:border-grey-600 ' +
        'transition bg-transparent text-sm ' +
        'outline-none dark:text-grey-100 ' +
        'disabled:bg-grey-200 disabled:dark:bg-grey-800 disabled:dark:text-grey-200 shadow-none' +
        (props.className ? ' ' + props.className : '')
      }
      onKeyDown={e => {
        if (e.key === 'Enter' && e.metaKey && props.onMetaEnter) {
          props.onMetaEnter();
        } else if (e.key === 'Enter' && e.ctrlKey && props.onCtrlEnter) {
          props.onCtrlEnter();
        }
        else if (e.key === 'Enter' && props.onEnter) {
          props.onEnter();
        }
      }}
    />
  );
}

function ToolBarButton(props: ToolBarButtonProps) {
  return (
    <button
      className={
        'px-4 py-1 border-r border-grey-400 dark:border-grey-600 transition ' +
        'bg-transparent hover:bg-grey-200 dark:hover:bg-grey-800 ' +
        'outline-none focus:bg-grey-200 dark:focus:bg-grey-800 '
      }
      onClick={props.onClick}
    >{props.children}</button>
  );

}

export {
  ToolBarInput,
  ToolBarButton
}
