import Stack from "../layout/Stack.tsx";
import {Hr} from "../fragments/Hr.tsx";
import {FormGroup, FormSection} from "../form/Form.tsx";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {Checkbox} from "../form/Checkbox.tsx";
import {Button} from "../form/Button.tsx";
import {TextInput} from "../form/TextInput.tsx";
import {useState} from "react";
import {assertValue, checkFlag, lengthCheck, verifyAll} from "../../modules/formValidator.ts";
import axios from "axios";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import startRecaptcha from "../../modules/recaptcha.ts";
import Alert from "../form/Alert.tsx";

function GoogleCompleteRegister() {
  const {executeRecaptcha} = useGoogleReCaptcha();

  const [username, setUsername] = useState<string>('');
  const [consentCheck, setConsentCheck] = useState<boolean>(false);
  const [verifyCheck, setVerifyCheck] = useState<boolean>(false);

  const [formState, setFormState] = useState<number>(0);
  const [working, setWorking] = useState(false);

  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const navigate = useNavigate();

  function validateForm() {
    setWorking(true);
    verifyAll(
      completeRegister,
      whenFormInvalid,

      lengthCheck(username, 1, 100, 0),
      assertValue<boolean>(consentCheck, true, 1),
      assertValue<boolean>(verifyCheck, true, 2)
    );
  }

  function completeRegister() {
    try {
      const token = startRecaptcha({executeRecaptcha}, 'signup/google');
      axios.post('/api/auth/google/register', {
        code: code,
        username: username,
        recaptcha: token
      }).then(() => {
        navigate('/user/n/welcome');
      }).catch(err => {
        const error = err.response.data?.message;
        switch (error) {
          case 'Recaptcha failed':
            setFormState(1 << 4);
            break;
          default:
            setFormState(1 << 5);
        }
      }).finally(() => {
        setWorking(false);
      });
    } catch {
      setFormState(1 << 3);
      setWorking(false);
    }
  }

  function whenFormInvalid(formFlag: number) {
    setFormState(formFlag);
    setWorking(false);
  }

  if (error) {
    return (
      <div className={'w-full px-5 sm:w-3/4 lg:w-1/2 pt-3 mx-auto'}>
        <Stack direction={'row'} className={'gap-4'}>
          <p className={'!text-5xl logo'}>BLINK</p>
          <p className={'text-2xl font-bold my-3'}>Google로 회원가입</p>
        </Stack>
        <Hr/>
        <Alert variant={'errorFill'}>Google으로 회원가입할 수 없습니다.</Alert>
      </div>
    )
  }

  return (
    <div className={'w-full px-5 sm:w-3/4 lg:w-1/2 pt-3 mx-auto'}>
      <Stack direction={'row'} className={'gap-4'}>
        <p className={'!text-5xl logo'}>BLINK</p>
        <p className={'text-2xl font-bold my-3'}>Google로 회원가입</p>
      </Stack>
      <Hr/>
      <p>Google을 이용해서 BLINK에 회원가입합니다.</p>
      <Stack className={'gap-4 my-4'}>
        <FormSection title={'기본 정보'}>
          <FormGroup label={'이름'}>
            <TextInput
              placeholder={'이름'}
              size={'sm'}
              label={'이름'}
              value={username}
              setter={setUsername}
              invalid={checkFlag(formState, 0)}
              error={'이름은 100자 이하로 입력해주세요.'}
              authComplete={'nickname'}
              disabled={working}
            />
          </FormGroup>
        </FormSection>

        <FormSection title={'필수 약관'}>
          <Stack className={'border border-neutral-400 dark:border-neutral-600 px-4 py-3 gap-2 rounded-lg'}>
            <Link to={'/docs/eula'}>BLINK 이용약관 &gt;</Link>
            <Link to={'/docs/privacy'}>BLINK 개인정보 처리방침 &gt;</Link>
          </Stack>
          <Checkbox
            id={'eula-agree'}
            label={'이상의 내용을 모두 이해했고, 동의합니다.'}
            checked={consentCheck}
            setter={setConsentCheck}
            invalid={checkFlag(formState, 1)}
            disabled={working}
            error={'약관에 동의해야 회원가입할 수 있습니다.'}
          />
        </FormSection>

        <FormSection title={'BLINK 재학생 확인에 관한 사항'}>
          <ul
            className={'list-outside list-disc border border-neutral-400 dark:border-neutral-600 pl-8 pr-4 py-3 rounded-lg'}>
            <li className={'my-1'}>BLINK 서비스는 서비스 이용 당시 대한민국의 중등교육기관(중학교 및 고등학교)에 재학중인 학생만 이용 가능합니다.</li>
            <li className={'my-1'}>BLINK 서비스를 사용하려면 BLINK 계정을 만든 후 재학생 확인을 받아야 합니다.</li>
            <li className={'my-1'}>계정이 만들어진 후 1년간 재학생 확인이 이루어지지 않은 계정은 임의로 삭제될 수 있습니다.</li>
          </ul>
          <Checkbox
            id={'student-verify'}
            label={'위의 내용을 모두 확인했습니다.'}
            checked={verifyCheck}
            setter={setVerifyCheck}
            invalid={checkFlag(formState, 2)}
            disabled={working}
            error={'내용을 확인해주세요.'}
          />
        </FormSection>
      </Stack>

      {checkFlag(formState, 3) &&
        <p className={'my-2 text-red-500 dark:text-red-300'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</p>}
      {checkFlag(formState, 4) &&
        <p className={'my-2 text-red-500 dark:text-red-300'}>사용자 보호를 위해 지금은 계정을 만들 수 없습니다.</p>}
      {checkFlag(formState, 5) && <p className={'my-2 text-red-500 dark:text-red-300'}>계정을 만들지 못했습니다.</p>}

      <Button onClick={validateForm}>회원가입</Button>
    </div>
  )
}

export default GoogleCompleteRegister;
