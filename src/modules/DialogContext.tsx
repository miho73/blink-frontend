import {createContext, useContext, useState, ReactNode, useEffect} from "react";
import ClassTransition from "../views/frames/ClassTransition.tsx";
import Stack from "../views/layout/Stack.tsx";
import {Button, LinkButton} from "../views/form/Button.tsx";
import {Hr} from "../views/fragments/Hr.tsx";

interface DialogProps {
  title?: string | null;
  content?: ReactNode;
  confirmText?: string;
  closeText?: string;
  closeOnClickBackground?: boolean;
  onConfirm?: () => void;
}

interface DialogContextType {
  showDialog: (props: Omit<DialogProps, "isOpen">) => void;
  hideDialog: () => void;
}

const DialogContext = createContext<DialogContextType | null>(null);

function DialogProvider({children}: {children: ReactNode}) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [dialog, setDialog] = useState<DialogProps>({});

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  function handleBackgroundClick() {
    if (dialog.closeOnClickBackground) {
      hideDialog();
    }
  }

  function showDialog(
    {title, content, closeOnClickBackground, confirmText, closeText, onConfirm}: Omit<DialogProps, "isOpen">
  ) {
    let cocb = true;
    if(closeOnClickBackground !== undefined) {
      cocb = closeOnClickBackground;
    }
    setDialog({
      title,
      content,
      confirmText,
      closeText,
      onConfirm,
      closeOnClickBackground: cocb,
    });
    setIsOpen(true)
  }

  function hideDialog() {
    setIsOpen(false)
  }


  return (
    <DialogContext.Provider value={{showDialog, hideDialog}}>
      {children}

      <ClassTransition
        mounted={isOpen}
        duration={200}
        beforeEnter={'opacity-0'}
        afterEnter={'opacity-100'}
        beforeLeave={'opacity-100'}
        afterLeave={'opacity-100'}
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
              className={
              'fixed bottom-0 left-0 w-full bg-neutral-800 ' +
                'rounded-t-2xl'
            }
            >
              <Stack direction={'row'} className={'justify-end px-2 py-1'}>
                <LinkButton
                  className={'px-3 py-2'}
                  onClick={hideDialog}
                >{dialog.closeText}</LinkButton>
              </Stack>
              <Hr className={'m-0'}/>
              <Stack className={'mx-4 my-4 gap-4'}>
                <p>{dialog.content}</p>
                <Button
                  color={'accent'}
                  onClick={dialog.onConfirm}
                >{dialog.confirmText}</Button>
              </Stack>
            </div>
          </ClassTransition>
        </div>
      </ClassTransition>
    </DialogContext.Provider>
  );
}

function useDialog() {
  const context = useContext(DialogContext);
  if (!context) throw new Error("useDialog must be used within a DialogProvider");
  return context;
}

export {
  DialogProvider,
  useDialog
}
