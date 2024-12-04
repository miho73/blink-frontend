import Stack from "../layout/Stack.tsx";
import {TextInput} from "../form/TextInput.tsx";
import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {Button} from "../form/Button.tsx";
import {checkFlag, lengthCheck, lengthCheckMin, verifyAll} from "../../modules/formValidator.ts";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import axios from "axios";
import startRecaptcha from "../../modules/recaptcha.ts";
import Alert from "../form/Alert.tsx";
import {Hr} from "../fragments/Hr.tsx";

function PasswordSignIn() {

  const {executeRecaptcha} = useGoogleReCaptcha();
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [formState, setFormState] = useState<number>(0);
  const [working, setWorking] = useState<boolean>(false);

  const navigate = useNavigate();

  function validateForm() {
    setWorking(true);

    verifyAll(
      completeSignin,
      whenFormInvalid,

      lengthCheck(id, 1, 255, 0),
      lengthCheckMin(password, 6, 0),
    );
  }

  function completeSignin() {
    try {
      const token = startRecaptcha({executeRecaptcha}, 'signin/password');
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
          setFormState(1 << 0);
        } else {
          if (message === 'Recaptcha failed') {
            setFormState(1 << 1);
          } else {
            setFormState(1 << 4);
          }
        }
      }).finally(() => {
        setWorking(false);
      });
    }
    catch {
      setFormState(1 << 2);
      setWorking(false);
    }
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
      <Stack className={'mt-6 w-[300px] gap-2 mb-2'}>
        <Link to={'/auth'} className={'href-blue !no-underline w-fit'}>&lt; 로그인 방법 선택</Link>
        <Hr className={'my-1'}/>
        <TextInput
          placeholder={'ID'}
          size={'lg'}
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
          size={'lg'}
          label={'Password'}
          value={password}
          setter={setPassword}
          authComplete={'current-password'}
          onEnter={validateForm}
          disabled={working}
        />
        <Button onClick={validateForm} className={'w-[300px]'} disabled={working}>로그인</Button>
      </Stack>

      {checkFlag(formState, 0) &&
        <Alert variant={'error'} className={'my-2 text-center'}>ID 혹은 암호가 잘못되었습니다.</Alert>}
      {checkFlag(formState, 1) &&
        <Alert variant={'error'} className={'my-2 text-center'}>사용자 보호를 위해 지금은 로그인할 수 없습니다.</Alert>}
      {checkFlag(formState, 2) &&
        <Alert variant={'error'} className={'my-2 text-center'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</Alert>}
      {checkFlag(formState, 4) &&
        <Alert variant={'error'} className={'my-2 text-center'}>로그인하지 못했습니다.</Alert>
      }

      <Stack direction={'row'} className={'gap-4 my-1'}>
        <Link to={'/auth/iforgot'} className={'href-blue'}>암호 찾기</Link>
        <Link to={'/auth/register'} className={'href-blue'}>회원가입</Link>
      </Stack>
    </div>
  );
}

export default PasswordSignIn;
