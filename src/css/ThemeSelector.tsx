import React from "react";

interface ThemeSelectorProps {
  light: React.ReactElement;
  dark: React.ReactElement;
  className?: string;
}

function ThemeSelector(props: ThemeSelectorProps) {
  return (
    <>
      <div className={'block dark:hidden' + (props.className ? ' ' + props.className : '')}>
        {props.light}
      </div>
      <div className={'hidden dark:block' + (props.className ? ' ' + props.className : '')}>
        {props.dark}
      </div>
    </>
  )
}

export default ThemeSelector;
