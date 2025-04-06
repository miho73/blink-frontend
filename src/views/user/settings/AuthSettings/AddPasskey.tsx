import Stack from "../../../layout/Stack.tsx";
import {Button} from "../../../form/Button.tsx";
import {checkFlag} from "../../../../modules/formValidator.ts";
import Alert from "../../../form/Alert.tsx";
import {useState} from "react";
import startRecaptcha from "../../../../modules/recaptcha.ts";
import axios from "axios";
import {startRegistration} from "@simplewebauthn/browser";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";

function AddPasskey(
  { reload }: {reload: () => void}
) {
  const {executeRecaptcha} = useGoogleReCaptcha();
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [working, setWorking] = useState(false);
  const [workState, setworkState] = useState<number>(0);

  async function addPasskey() {
    setWorking(true);

    try {
      const token = await startRecaptcha({executeRecaptcha}, 'register/passkey');

      axios.get(
        '/api/auth/passkey/register-option',
        {headers: {'Authorization': `Bearer ${jwt}`}}
      )
        .then(res => {
          startRegistration({
            optionsJSON: res.data['option']
          })
            .then(attestation => {
              axios.post('/api/auth/passkey/register', {
                recaptcha: token,
                attestation: attestation
              }, {
                headers: {'Authorization': `Bearer ${jwt}`}
              }).then(() => {
                setworkState(1 << 0);
                reload();
              }).catch(err => {
                const error = err.response.data?.message
                switch (error) {
                  case 'Session not found':
                    setworkState(1 << 5);
                    break;
                  case 'Identity not found':
                    setworkState(1 << 6);
                    break;
                  case 'Register option not found':
                    setworkState(1 << 7);
                    break;
                  case 'Authenticator not found':
                    setworkState(1 << 8);
                    break;
                  case 'Registration ID already exists':
                    setworkState(1 << 9);
                    break;
                  case 'Recaptcha verification failed':
                    setworkState(1 << 10);
                    break;
                  default:
                    setworkState(1 << 1);
                    console.error(err);
                }
              }).finally(() => {
                setWorking(false);
              });
            }).catch(() => {
            setworkState(1 << 2);
            setWorking(false);
          });
        })
        .catch(() => {
          setworkState(1 << 3);
          setWorking(false);
        });
    } catch {
      setworkState(1 << 4);
      setWorking(false);
    }
  }

  return (
    <>
      <p>패스키를 사용하면 디바이스의 지문 인식, 얼굴 인식, 화면 잠금, 혹은 하드웨어 보안키를 사용하여 안전하게 BLINK에 로그인할 수 있습니다. 본인 소유의 디바이스에서만
        패스키를 설정해야 합니다.</p>

      <Stack className={'my-3'}>
        <Button color={'accent'} className={'w-fit'} onClick={addPasskey} disabled={working}>패스키 등록</Button>

        {checkFlag(workState, 0) && <Alert variant={'success'}>Passkey를 추가했습니다.</Alert>}
        {checkFlag(workState, 1) && <Alert variant={'error'}>Passkey를 추가하지 못했습니다.</Alert>}
        {checkFlag(workState, 3) && <Alert variant={'error'}>Passkey 정보를 받아오지 못했습니다.</Alert>}
        {checkFlag(workState, 4) && <Alert variant={'error'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</Alert>}
        {checkFlag(workState, 5) && <Alert variant={'error'}>Passkey 세션이 만료되었습니다.</Alert>}
        {checkFlag(workState, 6) && <Alert variant={'error'}>Passkey를 추가하고자 하는 사용자가 없습니다.</Alert>}
        {checkFlag(workState, 7) && <Alert variant={'error'}>Passkey 세션이 만료되었습니다.</Alert>}
        {checkFlag(workState, 8) && <Alert variant={'error'}>사용할 수 없는 인증기입니다.</Alert>}
        {checkFlag(workState, 9) && <Alert variant={'error'}>인증 ID가 중복되었습니다. 다시 시도해주세요.</Alert>}
        {checkFlag(workState, 10) && <Alert variant={'error'}>사용자 보호를 위해 지금은 Passkey를 추가할 수 없습니다.</Alert>}
      </Stack>
    </>
  );
}

export default AddPasskey;
