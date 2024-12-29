import {FormGroup, FormSection} from "../../../form/Form.tsx";
import {TextInput} from "../../../form/TextInput.tsx";
import {Button} from "../../../form/Button.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import Alert from "../../../form/Alert.tsx";
import {CancelIconDark, CancelIconLight, CheckIconDark, CheckIconLight, Svg} from "../../../../assets/svgs/svg.tsx";
import ThemeSelector from "../../../../css/ThemeSelector.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {checkFlag, lengthCheck, regexCheck, verifyAll} from "../../../../modules/formValidator.ts";
import InputGroup from "../../../form/InputGroup.tsx";
import startRecaptcha from "../../../../modules/recaptcha.ts";

function GeneralSettings() {
  const {executeRecaptcha} = useGoogleReCaptcha();
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailVerified, setEmailVerified] = useState<boolean>(false);

  const [pageState, setPageState] = useState<number>(0);
  const [formState, setFormState] = useState<number>(0);
  const [working, setWorking] = useState<boolean>(false);

  let emailSidecar = <ThemeSelector light={<Svg src={CancelIconLight}/>} dark={<Svg src={CancelIconDark}/>}
                                    className={'w-[20px]'}/>;
  if (emailVerified) {
    emailSidecar =
      <ThemeSelector light={<Svg src={CheckIconLight}/>} dark={<Svg src={CheckIconDark}/>} className={'w-[20px]'}/>;
  }

  function startWorking() {
    setWorking(true);
    verifyAll(
      updateProfile,
      invalidForm,

      lengthCheck(username, 1, 100, 0),
      lengthCheck(email, 5, 255, 1),
      regexCheck(email, /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 1)
    )
  }

  async function updateProfile() {
    try {
      const token = await startRecaptcha({executeRecaptcha}, 'profile/update');

      axios.patch(
        '/api/user',
        {
          username: username,
          email: email,
          recaptcha: token
        },
        {headers: {'Authorization': `Bearer ${jwt}`}}
      ).then(() => {
        setFormState(1 << 3);
        loadProfile();
      }).catch(err => {
        const error = err.response.data?.message;
        switch (error) {
          case 'Recaptcha verification failed':
            setFormState(1 << 4);
            break;
          case 'Identity not found':
            setFormState(1 << 5);
            break;
          default:
            setFormState(1 << 6);
        }
      }).finally(() => {
        setWorking(false);
      });
    } catch {
      setFormState(1 << 2);
      setWorking(false);
    }
  }

  function invalidForm(flag: number) {
    setFormState(flag);
    setWorking(false);
  }

  function loadProfile() {
    axios.get(
      '/api/user',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      setUsername(res.data.user.username);
      setEmail(res.data.user.email);
      setEmailVerified(res.data.user.emailVerified);
      setPageState(2);
    }).catch(() => {
      setPageState(1);
    });
  }

  function randomName() {
    let name = '';
    const characters = 'iIl!';
    const chars = characters.length;
    let counter = 0;
    while (counter < 15) {
      name += characters.charAt(Math.floor(Math.random() * chars));
      counter += 1;
    }
    setUsername(name);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  if (pageState === 1) {
    return (
      <FormSection title={'프로필'}>
        <Alert variant={'errorFill'}>프로필을 불러오지 못했습니다.</Alert>
      </FormSection>
    )
  } else if (pageState === 2 || pageState === 0) {
    return (
      <FormSection title={'프로필'}>
        <FormGroup label={'이름'} strong>
          <InputGroup>
            <TextInput
              placeholder={'이름'}
              label={'이메일'}
              value={username}
              setter={setUsername}
              authComplete={'username'}
              disabled={working}
              invalid={checkFlag(formState, 0)}
              error={'이름은 100자 이하로 입력해주세요.'}
            />
            <Button onClick={randomName} disabled={working}>무작위</Button>
          </InputGroup>
          <label className={'mt-2 text-caption dark:text-caption-dark text-sm'}>BLINK에서 사용할 이름입니다.</label>
        </FormGroup>
        <FormGroup
          label={'이메일'}
          strong
          sidecar={emailSidecar}
        >
          <TextInput
            placeholder={'이메일'}
            label={'이메일'}
            value={email}
            setter={setEmail}
            authComplete={'email'}
            disabled={working}
            invalid={checkFlag(formState, 1)}
            error={'올바른 이메일을 입력해주세요.'}
          />
          <label className={'mt-2 text-caption dark:text-caption-dark text-sm'}>BLINK에서 중요한 사항을 전달할 이메일입니다.</label>
        </FormGroup>

        {checkFlag(formState, 2) && <Alert variant={'error'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</Alert>}
        {checkFlag(formState, 3) && <Alert variant={'success'}>프로필을 수정했습니다.</Alert>}
        {checkFlag(formState, 4) && <Alert variant={'error'}>사용자 보호를 위해 지금은 프로필을 수정할 수 없습니다.</Alert>}
        {checkFlag(formState, 5) && <Alert variant={'error'}>사용자를 찾지 못했습니다.</Alert>}
        {checkFlag(formState, 6) && <Alert variant={'error'}>프로필을 업데이트하지 못했습니다.</Alert>}

        <Button className={'w-fit'} onClick={startWorking} disabled={working}>프로필 업데이트</Button>
      </FormSection>
    );
  }
}

export default GeneralSettings;
