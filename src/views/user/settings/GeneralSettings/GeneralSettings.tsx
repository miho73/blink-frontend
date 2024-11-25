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
import Stack from "../../../layout/Stack.tsx";

function GeneralSettings() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);
  const [pageState, setPageState] = useState<number>(0);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailVerified, setEmailVerified] = useState<boolean>(false);
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
      completeRecaptcha,
      invalidForm,

      lengthCheck(username, 1, 100, 0),
      lengthCheck(email, 5, 255, 1),
      regexCheck(email, /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 1)
    )
  }

  const {executeRecaptcha} = useGoogleReCaptcha();

  async function checkRecaptcha() {
    if (!executeRecaptcha) {
      throw new Error('recaptcha not ready');
    }

    return await executeRecaptcha('profile/update');
  }

  function completeRecaptcha() {
    setWorking(true);
    checkRecaptcha()
      .then(token => {
        updateProfile(token);
      }).catch(() => {
        setFormState(1 << 2);
      });
  }
  function invalidForm(flag: number) {
    setFormState(flag);
    setWorking(false);
  }

  function updateProfile(token: string) {
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

  // TODO: 로딩중 애니메이션 다듬기
  useEffect(() => {
    loadProfile();
  }, [jwt]);

  // TODO: 캡션 다듬기
  if (pageState === 1) {
    return (
      <FormSection title={'프로필'}>
        <Alert variant={'error'}>프로필을 불러오지 못했습니다.</Alert>
      </FormSection>
    )
  } else if (pageState === 2 || pageState === 0) {
    return (
      <FormSection title={'프로필'}>
        <FormGroup label={'이름'} strong>
          <Stack direction={'row'} className={'gap-2'}>
            <TextInput
              placeholder={'이름'}
              label={'이메일'}
              value={username}
              setter={setUsername}
              size={'sm'}
              authComplete={'username'}
            />
            <Button
              size={'custom'}
              className={'w-fit px-5 py-3 !border-grey-400 dark:!border-grey-700'}
              onClick={randomName}
            >
              무작위
            </Button>
          </Stack>
          <label className={'my-2 text-grey-600 dark:text-grey-400'}>이 이름은 BLINK 내에서 사용되는 이름입니다.</label>
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
            size={'sm'}
            authComplete={'email'}
          />
          <label className={'my-2 text-grey-600 dark:text-grey-400'}>이메일은 BLINK 내에서 사용되는 식별자입니다.</label>
        </FormGroup>

        {checkFlag(formState, 2) && <p className={'mb-2 text-red-500 dark:text-red-300'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</p>}
        {checkFlag(formState, 3) && <p className={'mb-2 text-green-500 dark:text-green-300'}>프로필을 수정했습니다.</p>}
        {checkFlag(formState, 4) && <p className={'mb-2 text-red-500 dark:text-red-300'}>사용자 보호를 위해 지금은 프로필을 수정할 수 없습니다.</p>}
        {checkFlag(formState, 5) && <p className={'mb-2 text-red-500 dark:text-red-300'}>사용자를 찾지 못했습니다.</p>}
        {checkFlag(formState, 6) && <p className={'mb-2 text-red-500 dark:text-red-300'}>프로필을 업데이트하지 못했습니다.</p>}

        <Button size={'custom'} className={'w-fit px-5 py-3'} onClick={startWorking} disabled={working}>프로필 업데이트</Button>
      </FormSection>
    );
  }
}

export default GeneralSettings;
