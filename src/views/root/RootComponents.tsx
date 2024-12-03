import {ReactNode} from "react";
import Stack from "../layout/Stack.tsx";

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
        'px-2 py-1' +
        'transition bg-transparent text-sm ' +
        'outline-none dark:text-neutral-100 ' +
        'disabled:bg-neutral-200 disabled:dark:bg-neutral-800 disabled:dark:text-neutral-200 shadow-none' +
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
        'px-4 py-1 transition ' +
        'bg-transparent hover:bg-neutral-200 dark:hover:bg-neutral-800 ' +
        'outline-none focus:bg-neutral-200 dark:focus:bg-neutral-800 '
      }
      onClick={props.onClick}
    >{props.children}</button>
  );
}

function ToolBar(props: {children?: ReactNode}) {
  return (
    <Stack
      direction={'row'}
      className={
        'border border-neutral-400 dark:border-neutral-600 ' +
        'divide-x divide-neutral-400 dark:divide-neutral-600 overflow-clip'
      }
    >
      {props.children}
    </Stack>
  )
}

export {
  ToolBarInput,
  ToolBarButton,
      ToolBar
}
