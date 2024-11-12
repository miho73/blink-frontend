import Stack from "../../layout/Stack.tsx";
import {TextInput} from "../../form/TextInput.tsx";
import {useState} from "react";
import {Button} from "../../form/Button.tsx";

interface ChangePasswordProps {
  cancel: () => void
}

function ChangePassword(props: ChangePasswordProps) {
  const [oldPwd, setOldPwd] = useState<string>('');
  const [newPwd, setNewPwd] = useState<string>('');
  const [newPwdConfirm, setNewPwdConfirm] = useState<string>('');

  return (
    <Stack className={'gap-3'}>
      <TextInput
        type={'password'}
        placeholder={'새 암호'}
        label={'새 암호'}
        size={'sm'}
        authComplete={'new-password'}
        value={oldPwd}
        setter={setOldPwd}
      />
      <TextInput
        type={'password'}
        placeholder={'새 암호'}
        label={'새 암호'}
        size={'sm'}
        authComplete={'new-password'}
        value={newPwd}
        setter={setNewPwd}
      />
      <TextInput
        type={'password'}
        placeholder={'새 암호 확인'}
        label={'새 암호 확인'}
        size={'sm'}
        authComplete={'new-password'}
        value={newPwdConfirm}
        setter={setNewPwdConfirm}
      />
      <Stack direction={'row'} className={'gap-3'}>
        <Button className={'w-fit'} onClick={props.cancel}>취소</Button>
        <Button className={'w-fit'}>암호 변경</Button>
      </Stack>
    </Stack>
  )
}

export {
  ChangePassword
}
