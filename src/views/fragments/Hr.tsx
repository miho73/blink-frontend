function Hr({className}: { className?: string }) {
  return (
    <hr
      className={
        'border-neutral-400 dark:border-neutral-700' +
        (className ? ' ' + className : ' my-3')
      }
    />
  )
}

export {
  Hr
}
