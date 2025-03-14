import Stack from "../../../layout/Stack.tsx";
import {Button} from "../../../form/Button.tsx";
import {useDispatch} from "react-redux";
import {actions} from "../../../../modules/redux/UserInfoReducer.ts";
import {useNavigate} from "react-router-dom";
import Dialog from "../../../fragments/Dialog.tsx";
import {useState} from "react";

function SettingsToolButtons() {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [openLogoutConfirmDialog, setOpenLogoutConfirmDialog] = useState<boolean>(false);

  function handleLogout() {
    dispatch(actions.signOut());
    localStorage.removeItem('with-authentication');
    navigate('/auth');
  }

  return (
    <>
      <Stack>
        <Button className={'w-full'} onClick={() => setOpenLogoutConfirmDialog(true)}>로그아웃</Button>
      </Stack>

      <Dialog
        isOpen={openLogoutConfirmDialog}
        onConfirm={handleLogout}
        confirmText={'로그아웃'}
        finally={() => setOpenLogoutConfirmDialog(false)}
      >
        <p>정말로 로그아웃할까요?</p>
      </Dialog>
    </>
  )
}

export default SettingsToolButtons;
