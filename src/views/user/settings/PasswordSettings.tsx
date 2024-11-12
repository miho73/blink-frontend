import Stack from "../../layout/Stack.tsx";
import {TextInput} from "../../form/TextInput.tsx";
import {useState} from "react";
import {Button} from "../../form/Button.tsx";
import {assertValue, checkFlag, lengthCheckMin, verifyAll} from "../../../modules/formValidator.ts";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {FormGroup} from "../../form/Form.tsx";
import axios from "axios";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";

interface ChangePasswordProps {
  cancel: () => void;
  success: () => void;
}

function ChangePassword(props: ChangePasswordProps) {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt)

  const [oldPwd, setOldPwd] = useState<string>('');
  const [newPwd, setNewPwd] = useState<string>('');
  const [newPwdConfirm, setNewPwdConfirm] = useState<string>('');
  const [working, setWorking] = useState<boolean>(false);
  const [formState, setFormState] = useState<number>(0);

  function validateForm() {
    setWorking(true);
    verifyAll(
      completeRecaptcha,
      whenFormInvalid,

      lengthCheckMin(oldPwd, 6, 0),
      lengthCheckMin(newPwd, 6, 1),
      lengthCheckMin(newPwdConfirm, 6, 2),
      assertValue(newPwd, newPwdConfirm, 2)
    )
  }

  const {executeRecaptcha} = useGoogleReCaptcha();
  async function checkRecaptcha() {
    if (!executeRecaptcha) {
      throw new Error('recaptcha not ready');
    }

    return await executeRecaptcha('changePassword');
  }

  function completeRecaptcha() {
    setFormState(0);
    checkRecaptcha().then(token => {
      completeChange(token);
    }).catch(() => {
      setFormState(1 << 3);
    }).finally(() => {
      setWorking(false);
    });
  }

  function completeChange(token: string) {
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
    });
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
          size={'sm'}
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
          size={'sm'}
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
          size={'sm'}
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
        <Button className={'w-fit'} onClick={props.cancel}>취소</Button>
        <Button className={'w-fit'} onClick={validateForm}>암호 변경</Button>
      </Stack>
      { checkFlag(formState, 3) && <p className={'my-2 text-red-500 dark:text-red-300'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</p> }
      { checkFlag(formState, 4) && <p className={'my-2 text-red-500 dark:text-red-300'}>암호가 잘못됐습니다.</p> }
      { checkFlag(formState, 5) && <p className={'my-2 text-red-500 dark:text-red-300'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</p> }
      { checkFlag(formState, 6) && <p className={'my-2 text-red-500 dark:text-red-300'}>계정을 찾지 못했습니다.</p> }
      { checkFlag(formState, 7) && <p className={'my-2 text-red-500 dark:text-red-300'}>암호를 바꾸지 못했습니다.</p> }
    </Stack>
  )
}

export {
  ChangePassword
}
