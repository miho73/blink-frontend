import {cloneElement, ReactElement, useEffect, useState} from "react";

interface ClassTransitionProps {
  children: ReactElement;
  className?: string;
  duration?: number;
  delay?: number;
  easing?: string;
  mounted: boolean;
  beforeEnter?: string;
  afterEnter?: string;
  beforeLeave?: string;
  afterLeave?: string;
}

function ClassTransition(props: ClassTransitionProps) {
  const {
    children,
    className = '',
    duration = 200,
    delay = 10,
    mounted,
    beforeEnter = '',
    afterEnter = '',
    beforeLeave = '',
    afterLeave = '',
  } = props;

  const [classSuffix, setClassSuffix] = useState('');
  const [mount, setMount] = useState<boolean>(false);

  useEffect(() => {
    if(mounted) {
      setMount(true);
      setClassSuffix(beforeEnter);
      setTimeout(() => {
        setClassSuffix(afterEnter);
      }, delay);
    }
    else {
      setClassSuffix(beforeLeave);
      setTimeout(() => {
        setClassSuffix(afterLeave);
      }, delay);
      setTimeout(() => {
        setMount(false);
      }, duration+delay);
    }
  }, [mounted]);

  const cloned = cloneElement(
    children,
    {
      className: `${children.props.className} transition-all ${classSuffix} ${className}`,
      style: {transitionDuration: `${duration}ms`}
    }
  );

  if(mount) {
    return cloned;
  }
  else return null;
}

export default ClassTransition;
