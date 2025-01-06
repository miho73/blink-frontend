import Stack from "../layout/Stack.tsx";
import {Button, ButtonLink} from "../form/Button.tsx";
import {Checkbox} from "../form/Checkbox.tsx";
import {TextInput} from "../form/TextInput.tsx";
import {FormGroup, FormSection} from "../form/Form.tsx";
import {Hr} from "../fragments/Hr.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import {
  assertValue,
  checkFlag,
  lengthCheck,
  lengthCheckMin,
  regexCheck,
  verifyAll
} from "../../modules/formValidator.ts";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import axios from "axios";
import startRecaptcha from "../../modules/recaptcha.ts";
import Alert from "../form/Alert.tsx";

function CoreRegister() {
  const {executeRecaptcha} = useGoogleReCaptcha();

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [pwd, setPwd] = useState<string>('');
  const [pwdConfirm, setPwdConfirm] = useState<string>('');
  const [consentCheck, setConsentCheck] = useState<boolean>(false);
  const [verifyCheck, setVerifyCheck] = useState<boolean>(false);

  const [formState, setFormState] = useState<number>(0);
  const [working, setWorking] = useState<boolean>(false);

  const navigate = useNavigate();

  function validateForm() {
    setWorking(true);
    verifyAll(
      completeRegister,
      whenFormInvalid,

      lengthCheck(username, 1, 100, 0),
      regexCheck(email, /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 1),
      lengthCheck(email, 5, 255, 1),

      lengthCheck(id, 1, 255, 4),
      lengthCheckMin(pwd, 6, 5),

      assertValue<string>(pwd, pwdConfirm, 6),

      assertValue<boolean>(consentCheck, true, 2),
      assertValue<boolean>(verifyCheck, true, 3)
    );
  }

  async function completeRegister() {
    try {
      const token = await startRecaptcha({executeRecaptcha}, 'signup/password');

      axios.post('/api/auth/password/register', {
        username: username,
        email: email,
        id: id,
        password: pwd,
        recaptcha: token
      }).then(() => {
        navigate('/user/n/welcome');
      }).catch(err => {
        const error = err.response.data?.message;
        switch (error) {
          case 'Recaptcha failed':
            setFormState(1 << 7);
            break;
          default:
            setFormState(1 << 8);
        }
      }).finally(() => {
        setWorking(false);
      });
    } catch {
      setFormState(1 << 9);
      setWorking(false);
    }
  }

  function whenFormInvalid(formFlag: number) {
    setFormState(formFlag);
    setWorking(false);
  }

  return (
    <div className={'w-full px-5 sm:w-3/4 lg:w-1/2 pt-3 mx-auto'}>
      <Stack direction={'row'} className={'gap-4'}>
        <p className={'!text-5xl logo'}>BLINK</p>
        <p className={'text-2xl font-bold my-3'}>회원가입</p>
      </Stack>

      <Hr/>

      <Stack className={'gap-4'}>
        <FormSection title={'기본 정보'}>
          <FormGroup label={'이름'}>
            <TextInput
              placeholder={'이름'}
              label={'이름'}
              value={username}
              setter={setUsername}
              invalid={checkFlag(formState, 0)}
              error={'이름은 100자 이하로 입력해주세요.'}
              authComplete={'nickname'}
              disabled={working}
            />
          </FormGroup>
          <FormGroup label={'이메일'}>
            <TextInput
              type={'email'}
              placeholder={'이메일'}
              label={'이메일'}
              value={email}
              setter={setEmail}
              invalid={checkFlag(formState, 1)}
              error={'올바른 이메일을 입력해주세요.'}
              authComplete={'email'}
              disabled={working}
            />
          </FormGroup>
        </FormSection>

        <FormSection title={'인증'}>
          <FormGroup label={'ID'}>
            <TextInput
              placeholder={'ID'}
              label={'ID'}
              value={id}
              setter={setId}
              invalid={checkFlag(formState, 4)}
              error={'ID는 255자 이하여야 합니다.'}
              authComplete={'username'}
              disabled={working}
            />
          </FormGroup>
          <FormGroup label={'암호'}>
            <TextInput
              type={'password'}
              placeholder={'암호'}
              label={'암호'}
              value={pwd}
              setter={setPwd}
              invalid={checkFlag(formState, 5)}
              error={'암호는 6자리 이상이여야 합니다.'}
              authComplete={'new-password'}
              disabled={working}
            />
          </FormGroup>
          <FormGroup label={'암호 확인'}>
            <TextInput
              type={'password'}
              placeholder={'암호 확인'}
              label={'암호 확인'}
              value={pwdConfirm}
              setter={setPwdConfirm}
              invalid={checkFlag(formState, 6)}
              error={'암호를 확인해주세요.'}
              authComplete={'new-password'}
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
            invalid={checkFlag(formState, 2)}
            error={'약관에 동의해야 회원가입할 수 있습니다.'}
            disabled={working}
          />
        </FormSection>

        <FormSection title={'BLINK 재학생 확인에 관한 사항'}>
          <ul
            className={'list-outside list-disc border border-neutral-400 dark:border-neutral-600 pl-8 pr-4 py-3 rounded-lg'}>
            <li className={'my-1'}>BLINK 서비스는 서비스 이용 당시 대한민국의 중등교육기관(중학교 및 고등학교)에 재학중인 학생만 이용 가능합니다.</li>
            <li className={'my-1'}>BLINK 서비스를 사용하려면 BLINK 계정을 만든 후 재학생 확인을 받아야 합니다.</li>
          </ul>
          <Checkbox
            id={'student-verify'}
            label={'위의 내용을 모두 확인했습니다.'}
            checked={verifyCheck}
            setter={setVerifyCheck}
            invalid={checkFlag(formState, 3)}
            error={'내용을 확인해주세요.'}
            disabled={working}
          />
        </FormSection>
      </Stack>

      {checkFlag(formState, 9) &&
        <Alert variant={'error'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</Alert>}
      {checkFlag(formState, 7) &&
        <Alert variant={'error'}>사용자 보호를 위해 지금은 계정을 만들 수 없습니다.</Alert>}
      {checkFlag(formState, 8) && <Alert variant={'error'}>계정을 만들지 못했습니다.</Alert>}

      <Stack direction={'row'} className={'my-4 gap-4'}>
        <ButtonLink to={'/auth'} disabled={working}>기존 계정으로 로그인</ButtonLink>
        <Button color={'accent'} onClick={validateForm} disabled={working}>회원가입</Button>
      </Stack>
    </div>
  )
}

export default CoreRegister;
