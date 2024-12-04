import {ReactElement, ReactNode} from "react";

interface SettingsTabProps {
  children: ReactNode;
  setter: () => void;
  icon: ReactElement;
  selected: boolean
}

function SettingsTabButton(props: SettingsTabProps) {
  return (
    <button
      onClick={props.setter}
      className={
        'my-1 py-2 pl-[20px] text-left font-medium flex justify-start items-center gap-3 transition border-l-4 border-transparent ' +
        (props.selected ? ' border-blue-600 dark:border-blue-500' : '')
      }
    >
      {props.icon}
      {props.children}
    </button>
  )
}

export default SettingsTabButton;
