import {Hr} from "./Hr.tsx";
import {CancelIcon, Svg} from "../../assets/svgs/svg.tsx";
import Stack from "../layout/Stack.tsx";
import {CSSTransition} from "react-transition-group";
import {ReactNode} from "react";

interface DialogProps {
  open: boolean;
  close: () => void;
  title?: string;
  children: ReactNode;
  closeByBackdrop?: boolean;
}

function Dialog(props: DialogProps) {
  return (
    <CSSTransition
      in={props.open}
      timeout={200}
      classNames={{
        enterActive: '!opacity-100',
        enterDone: '!opacity-100',
      }}
      appear
      mountOnEnter
      unmountOnExit
    >
      <div
        className={
          'absolute w-full h-full left-0 top-0 ' +
          'bg-black bg-opacity-60 opacity-0 ' +
          'flex justify-center items-center ' +
          'transition-opacity duration-200'
        }
        onClick={() => props.closeByBackdrop && props.close()}
      >
        <div
          className={'p-5 rounded-2xl border bg-grey-50 border-grey-100 dark:bg-grey-900 dark:border-grey-800'}
          onClick={e => e.stopPropagation()}
        >
          <Stack direction={'row'} className={'justify-between items-center'}>
            <p className={'text-xl font-bold mr-16'}>{props.title}</p>
            <button
              onClick={props.close}
            >
              <Svg src={CancelIcon} css cssColor={'white'} className={'w-5 h-5'}/>
            </button>
          </Stack>
          <Hr/>
          {props.children}
        </div>
      </div>
    </CSSTransition>
  );
}

export default Dialog;
