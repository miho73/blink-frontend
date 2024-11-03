interface StackProps {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  className?: string;
}

function Stack(props: StackProps) {
  return (
    <div
      className={
        'flex' +
        (props.direction === 'row' ? ' flex-row' : ' flex-col') +
        (props.className ? ' ' + props.className : '')
    }
    >
      {props.children}
    </div>
  )
}

export default Stack
