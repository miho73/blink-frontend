import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {actions} from "../../modules/redux/DialogReducer.ts";
import {useDispatch} from "react-redux";
import Stack from "../layout/Stack.tsx";
import {Hr} from "./Hr.tsx";
import {Button, LinkButton} from "../form/Button.tsx";
import ClassTransition from "../frames/ClassTransition.tsx";

function Dialog() {
  const dialogOpen = useAppSelector(state => state.dialogReducer.dialogOpen);
  const closeDialogByBackground = useAppSelector(state => state.dialogReducer.closeDialogByBackground);
  const closeText = useAppSelector(state => state.dialogReducer.closeText);
  const dialogContent = useAppSelector(state => state.dialogReducer.content);
  const confirmText = useAppSelector(state => state.dialogReducer.confirmText);

  const dispatch = useDispatch();

  function handleBackgroundClick() {
    if (closeDialogByBackground) {
      dispatch(actions.closeDialog());
    }
  }

  function closeDialog() {
    dispatch(actions.closeDialog());
  }

  return (
    <ClassTransition
      mounted={dialogOpen}
      duration={200}
      beforeEnter={'opacity-0'}
      afterEnter={'opacity-100'}
      beforeLeave={'opacity-100'}
      afterLeave={'opacity-0'}
    >
      <div
        onClick={handleBackgroundClick}
        className={
          'fixed left-0 top-0 bg-black bg-opacity-25 w-screen h-screen z-50'
        }
      >
        <ClassTransition
          mounted={dialogOpen}
          duration={300}
          className={'transform-gpu'}
          beforeEnter={'translate-y-full'}
          afterEnter={'translate-y-0'}
          beforeLeave={'translate-y-0'}
          afterLeave={'translate-y-full'}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={
              'fixed bottom-0 left-0 w-screen bg-neutral-800 ' +
              'rounded-t-2xl'
            }
          >
            <Stack direction={'row'} className={'justify-end px-2 py-1'}>
              <LinkButton
                className={'px-3 py-2'}
                onClick={closeDialog}
              >{closeText}</LinkButton>
            </Stack>
            <Hr className={'m-0'}/>
            <Stack className={'mx-4 my-4 gap-4'}>
              <p>{dialogContent}</p>
              <Button color={'accent'}>{confirmText}</Button>
            </Stack>
          </div>
        </ClassTransition>
      </div>
    </ClassTransition>
  );
}

export default Dialog;
