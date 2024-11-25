import Stack from "../layout/Stack.tsx";
import {TextInput} from "../form/TextInput.tsx";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button, ButtonLink} from "../form/Button.tsx";
import {checkFlag, lengthCheck, lengthCheckMin, verifyAll} from "../../modules/formValidator.ts";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import axios from "axios";

function PasswordSignin() {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [formState, setFormState] = useState<number>(0);
  const [working, setWorking] = useState<boolean>(false);

  const navigate = useNavigate();

  function validateForm() {
    setWorking(true);

    verifyAll(
      completeRecaptcha,
      whenFormInvalid,

      lengthCheck(id, 1, 255, 0),
      lengthCheckMin(password, 6, 1),
    )
  }

  const {executeRecaptcha} = useGoogleReCaptcha();

  async function checkRecaptcha() {
    if (!executeRecaptcha) {
      throw new Error('recaptcha not ready');
    }

    return await executeRecaptcha('signin/password');
  }

  function completeRecaptcha() {
    setFormState(0);
    checkRecaptcha()
      .then(token => {
        completeSignin(token);
      }).catch(() => {
        setFormState(1 << 2);
      }).finally(() => {
        setWorking(false);
      });
  }

  function completeSignin(token: string) {
    axios.post('/api/auth/password/login', {
      id: id,
      password: password,
      recaptcha: token
    }).then(res => {
      navigate('/auth/complete?jwt=' + res.data['jwt']);
    }).catch(err => {
      const status = err.response.status;
      const message = err.response.data['message'];
      if (status === 401) {
        setFormState(1 << 3);
      } else {
        if (message === 'Recaptcha failed') {
          setFormState(1 << 2);
        } else {
          setFormState(1 << 4);
        }
      }
    });
  }

  function whenFormInvalid(formFlag: number) {
    setFormState(formFlag);
    setWorking(false);
  }

  return (
    <div
      className={
        'w-full h-full flex flex-col justify-center items-center'
      }
    >
      <p className={'!text-5xl logo'}>BLINK</p>
      <Stack className={'mt-6 min-w-[350px] gap-3 mb-2'}>
        <TextInput
          placeholder={'ID'}
          size={'md'}
          label={'ID'}
          value={id}
          setter={setId}
          authComplete={'username'}
          onEnter={validateForm}
          disabled={working}
        />
        <TextInput
          placeholder={'Password'}
          type={'password'}
          size={'md'}
          label={'Password'}
          value={password}
          setter={setPassword}
          authComplete={'current-password'}
          onEnter={validateForm}
          disabled={working}
        />
      </Stack>

      {checkFlag(formState, 0) &&
        <p className={'my-2 text-red-500 dark:text-red-300 text-center'}>ID 혹은 암호가 잘못되었습니다.</p>}
      {checkFlag(formState, 1) &&
        <p className={'my-2 text-red-500 dark:text-red-300 text-center'}>ID 혹은 암호가 잘못되었습니다.</p>}
      {checkFlag(formState, 2) &&
        <p className={'my-2 text-red-500 dark:text-red-300 text-center'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</p>}
      {checkFlag(formState, 3) &&
        <p className={'my-2 text-red-500 dark:text-red-300 text-center'}>ID 혹은 암호가 잘못되었습니다.</p>}
      {checkFlag(formState, 4) && <p className={'my-2 text-red-500 dark:text-red-300 text-center'}>로그인하지 못했습니다.</p>}

      <Stack direction={'row'} className={'my-2 gap-4'}>
        <ButtonLink to={'/auth'} disabled={working}>다른 방법으로 로그인</ButtonLink>
        <Button onClick={validateForm} disabled={working}>로그인</Button>
      </Stack>
      <Stack direction={'row'} className={'gap-4 text-blue-600 dark:text-blue-300'}>
        <Link to={'/auth/iforgot'} className={'hover:underline'}>암호 찾기</Link>
        <Link to={'/auth/register'} className={'hover:underline'}>회원가입</Link>
      </Stack>
    </div>
  );
}

export default PasswordSignin;
