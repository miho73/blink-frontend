import ClassTransition from "../frames/ClassTransition.tsx";
import Stack from "../layout/Stack.tsx";
import {Button, LinkButton} from "../form/Button.tsx";
import {Hr} from "./Hr.tsx";
import {ReactNode, useEffect} from "react";

interface DialogProps {
  children?: ReactNode;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  finally?: () => void;
  working?: boolean;
  closeOnClickBackground?: boolean;
  isOpen: boolean;
}

function Dialog(
  {
    children,
    cancelText = '닫기',
    confirmText = '확인',
    onConfirm,
    onCancel,
    finally: onFinally,
    isOpen,
    working,
    closeOnClickBackground = true
  }: DialogProps
) {

  function handleBackgroundClick() {
    if (closeOnClickBackground) {
      closeDialog();
    }
  }

  function confirm() {
    if (working) return;
    if (onConfirm) {
      onConfirm();
    }
    if (onFinally) {
      onFinally();
    }
  }

  function closeDialog() {
    if (working) return;
    if (onCancel) {
      onCancel();
    }
    if (onFinally) {
      onFinally();
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <ClassTransition
      mounted={isOpen}
      duration={200}
      beforeEnter={'opacity-0'}
      afterEnter={'opacity-100'}
      beforeLeave={'opacity-100'}
      afterLeave={'opacity-0'}
    >
      <div
        onClick={handleBackgroundClick}
        className={
          'fixed left-0 top-0 bg-black bg-opacity-25 w-full h-screen z-50'
        }
      >
        <ClassTransition
          mounted={isOpen}
          duration={200}
          className={'transform-gpu'}
          beforeEnter={'translate-y-full'}
          afterEnter={'translate-y-0'}
          beforeLeave={'translate-y-0'}
          afterLeave={'translate-y-full'}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={'fixed bottom-0 left-0 w-full'}
          >
            <div className={'mx-auto w-full lg:w-1/2 max-w-[800px] bg-neutral-50 dark:bg-neutral-800 rounded-t-2xl'}>
              <Stack direction={'row'} className={'justify-end items-center px-2 py-1'}>
                <LinkButton
                  className={'px-3 py-2'}
                  onClick={closeDialog}
                >
                  {cancelText}
                </LinkButton>
              </Stack>

              <Hr className={'m-0'}/>

              <Stack className={'px-4 py-4 gap-2'}>
                {children}

                <Button
                  color={'accentLight'}
                  onClick={confirm}
                  className={'w-full'}
                  disabled={working}
                >
                  {confirmText}
                </Button>
              </Stack>
            </div>
          </div>
        </ClassTransition>
      </div>
    </ClassTransition>
  );
}

export default Dialog;
