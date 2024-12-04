interface AlertProps {
  variant: 'error' | 'warning' | 'success' | 'errorFill' | 'warningFill' | 'infoFill' | 'successFill';
  children?: React.ReactNode;
  className?: string;
}

const colorPalette: { error: string, success: string, warning: string, errorFill: string, warningFill: string, infoFill: string, successFill: string } = {
  error: 'text-red-500 dark:text-red-300',
  success: 'text-green-500 dark:text-green-300',
  warning: 'text-yellow-500 dark:text-yellow-300',
  errorFill: 'bg-red-100 !border-red-300 text-red-900 dark:bg-red-200 dark:bg-opacity-90 dark:!border-red-900 border px-5 py-3 rounded-lg',
  warningFill: 'bg-yellow-100 !border-yellow-300 text-yellow-900 dark:bg-yellow-200 dark:bg-opacity-90 dark:!border-yellow-900 border px-5 py-3 rounded-lg',
  infoFill: 'bg-sky-100 !border-sky-200 text-sky-900 dark:bg-sky-200 dark:bg-opacity-90 dark:!border-sky-800 border px-5 py-3 rounded-lg',
  successFill: 'bg-green-100 !border-green-300 text-green-900 dark:bg-green-200 dark:bg-opacity-90 dark:!border-green-900 border px-5 py-3 rounded-lg',
}

function Alert(props: AlertProps) {
  return (
    <p
      className={
        'my-2 ' +
        (colorPalette[props.variant]) +
        (props.className ? ' ' + props.className : '')
      }
    >
      {props.children}
    </p>
  )
}

export default Alert;
