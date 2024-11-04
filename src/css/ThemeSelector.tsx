import React from "react";

interface ThemeSelectorProps {
  light: React.ReactElement
  dark: React.ReactElement
}

function ThemeSelector(props: ThemeSelectorProps) {
  return (
    <>
      <div className={'block dark:hidden'}>
        {props.light}
      </div>
      <div className={'hidden dark:block'}>
        {props.dark}
      </div>
    </>
  )
}

export default ThemeSelector;
