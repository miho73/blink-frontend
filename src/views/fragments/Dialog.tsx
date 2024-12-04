import {Hr} from "./Hr.tsx";
import {CancelIcon, Svg} from "../../assets/svgs/svg.tsx";
import Stack from "../layout/Stack.tsx";
import {CSSTransition} from "react-transition-group";
import {ReactNode} from "react";
import {Button} from "../form/Button.tsx";
import {worker} from "globals";

interface DialogProps {
  open: boolean;
  close: () => void;
  title?: string;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string;
  cancelText?: string;
  working?: boolean;

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
        onClick={() => {
          if(props.working) return;
          if(props.closeByBackdrop) props.close();
        }}
      >
        <div
          className={
            'py-3 rounded-2xl border bg-neutral-50 dark:bg-neutral-900 dark:border-neutral-800 ' +
            'w-full mx-5 sm:w-1/2 md:w-[450px]'
          }
          onClick={e => e.stopPropagation()}
        >
          <Stack
            direction={'row'}
            className={'px-5 justify-between items-center'}
          >
            <p className={'text-2xl font-medium mr-16'}>{props.title}</p>
            <button
              onClick={() => {
                if(props.working) return;
                props.close();
              }}
            >
              <Svg src={CancelIcon} css cssColor={'white'} className={'w-5 h-5'}/>
            </button>
          </Stack>
          <Hr/>
          <div className={'px-5'}>{props.children}</div>
          <Hr/>
          <Stack direction={'row'} className={'px-5 gap-2 justify-end'}>
            <Button size={'sm'} onClick={props.onCancel} disabled={props.working}>{props.cancelText}</Button>
            <Button size={'sm'} onClick={props.onOk} disabled={props.working}>{props.okText}</Button>
          </Stack>
        </div>
      </div>
    </CSSTransition>
  );
}

export default Dialog;
