interface AlertProps {
  variant: 'error' | 'warning' | 'info' | 'success';
  children: React.ReactNode;
}

const colorPalette: {error: string, warning: string, info: string, success: string} = {
  error: 'bg-red-100 border-red-300 text-red-900 dark:bg-red-200 dark:bg-opacity-90 dark:border-red-900',
  warning: 'bg-yellow-100 border-yellow-300 text-yellow-900 dark:bg-yellow-200 dark:bg-opacity-90 dark:border-yellow-900',
  info: 'bg-sky-100 border-sky-300 text-sky-900 dark:bg-sky-200 dark:bg-opacity-90 dark:border-sky-900',
  success: 'bg-green-100 border-green-300 text-green-900 dark:bg-green-200 dark:bg-opacity-90 dark:border-green-900',
}

function Alert(props: AlertProps) {
  return (
    <p
      className={
        'px-5 py-3 rounded-lg border my-2 ' +
        (colorPalette[props.variant])
      }
    >
      {props.children}
    </p>
  )
}

export default Alert;
