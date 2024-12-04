import Stack from "../../../layout/Stack.tsx";
import {TextInput} from "../../../form/TextInput.tsx";
import {useState} from "react";
import {Button} from "../../../form/Button.tsx";
import {assertValue, checkFlag, lengthCheckMin, verifyAll} from "../../../../modules/formValidator.ts";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {FormGroup} from "../../../form/Form.tsx";
import axios from "axios";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import startRecaptcha from "../../../../modules/recaptcha.ts";
import Alert from "../../../form/Alert.tsx";

interface ChangePasswordProps {
  cancel: () => void;
  success: () => void;
}

function ChangePassword(props: ChangePasswordProps) {
  const {executeRecaptcha} = useGoogleReCaptcha();
  const jwt = useAppSelector(state => state.userInfoReducer.jwt)

  const [oldPwd, setOldPwd] = useState<string>('');
  const [newPwd, setNewPwd] = useState<string>('');
  const [newPwdConfirm, setNewPwdConfirm] = useState<string>('');
  const [working, setWorking] = useState<boolean>(false);
  const [formState, setFormState] = useState<number>(0);

  function validateForm() {
    setWorking(true);
    verifyAll(
      completeChange,
      whenFormInvalid,

      lengthCheckMin(oldPwd, 6, 0),
      lengthCheckMin(newPwd, 6, 1),
      lengthCheckMin(newPwdConfirm, 6, 2),
      assertValue<string>(newPwd, newPwdConfirm, 2)
    )
  }

  async function completeChange() {
    try {
      const token = await startRecaptcha({executeRecaptcha}, 'changePassword');

      axios.patch(
        '/api/auth/password/update', {
          current_password: oldPwd,
          new_password: newPwd,
          recaptcha: token
        },
        {headers: {'Authorization': `Bearer ${jwt}`}}
      ).then(() => {
        props.success();
      }).catch(err => {
        const error = err.response.data.message;
        switch (error) {
          case 'Password mismatch':
            setFormState(1 << 4);
            break;
          case 'Recaptcha failed':
            setFormState(1 << 5);
            break;
          case 'Identity not found':
            setFormState(1 << 6);
            break;
          default:
            setFormState(1 << 7);
        }
      }).finally(() => {
        setWorking(false);
      });
    }
    catch {
      setFormState(1 << 3);
      setWorking(false);
    }
  }

  function whenFormInvalid(flag: number) {
    setFormState(flag);
    setWorking(false)
  }

  return (
    <Stack>
      <FormGroup label={'기존 암호'}>
        <TextInput
          type={'password'}
          placeholder={'기존 암호'}
          label={'기존 암호'}
          authComplete={'new-password'}
          value={oldPwd}
          setter={setOldPwd}
          onEnter={validateForm}
          disabled={working}
          invalid={checkFlag(formState, 0)}
          error={'올바른 암호를 입력해주세요.'}
        />
      </FormGroup>
      <FormGroup label={'새 암호'}>
        <TextInput
          type={'password'}
          placeholder={'새 암호'}
          label={'새 암호'}
          authComplete={'new-password'}
          value={newPwd}
          setter={setNewPwd}
          onEnter={validateForm}
          disabled={working}
          invalid={checkFlag(formState, 1)}
          error={'암호는 6자리 이상이여야 합니다.'}
        />
      </FormGroup>
      <FormGroup label={'암호 확인'}>
        <TextInput
          type={'password'}
          placeholder={'암호 확인'}
          label={'암호 확인'}
          authComplete={'new-password'}
          value={newPwdConfirm}
          setter={setNewPwdConfirm}
          onEnter={validateForm}
          disabled={working}
          invalid={checkFlag(formState, 2)}
          error={'암호를 확인해주세요.'}
        />
      </FormGroup>
      <Stack direction={'row'} className={'gap-3 mt-2'}>
        <Button className={'w-fit'} onClick={props.cancel} disabled={working}>취소</Button>
        <Button className={'w-fit'} onClick={validateForm} disabled={working}>암호 변경</Button>
      </Stack>
      {checkFlag(formState, 3) &&
        <Alert variant={'error'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</Alert> }
      {checkFlag(formState, 4) &&
        <Alert variant={'error'}>암호가 잘못됐습니다.</Alert> }
      {checkFlag(formState, 5) &&
        <Alert variant={'error'}>사용자 보호를 위해 지금은 암호를 바꿀 수 없습니다.</Alert> }
      {checkFlag(formState, 6) &&
        <Alert variant={'error'}>계정을 찾지 못했습니다.</Alert> }
      {checkFlag(formState, 7) &&
        <Alert variant={'error'}>암호를 바꾸지 못했습니다.</Alert> }
    </Stack>
  )
}

export {
  ChangePassword
}
