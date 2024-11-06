import {ReactNode} from "react";

interface SelectProps {
  options: string[];
  id: string[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

function Select(props: SelectProps) {
  const options: ReactNode[] = [];

  props?.options?.forEach((option, index) => {
    options.push(
      <option key={index} value={props.id[index]}>{option}</option>
    );
  });

  return (
    <select
      className={
        'px-3 py-2 bg-transparent border outline-none rounded-lg transition ' +
        'border outline-none border-grey-400 shadow-blue-300 focus:border-blue-500 ' +
        'dark:bg-grey-900 dark:border-grey-700 dark:text-grey-100 dark:shadow-blue-400 dark:focus:border-blue-400' +
        (props.className ? ` ${props.className}` : '')
      }
    >
      {options}
    </select>
  )
}

export default Select
