import Stack from "../../../layout/Stack.tsx";
import {Button} from "../../../form/Button.tsx";
import {FormGroup} from "../../../form/Form.tsx";
import {AuthInfo} from "./AuthSettings.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import startRecaptcha from "../../../../modules/recaptcha.ts";
import axios from "axios";
import {startRegistration} from "@simplewebauthn/browser";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import {useState} from "react";
import {checkFlag} from "../../../../modules/formValidator.ts";
import Alert from "../../../form/Alert.tsx";
import PasskeyRow, {Passkey} from "./PasskeyRow.tsx";

function PasskeySettings(
  {
    authInfo,
    reload
  }: {
    authInfo: AuthInfo | undefined,
    reload: () => void
  }
) {
  const {executeRecaptcha} = useGoogleReCaptcha();
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [addPasskeyState, setAddPasskeyState] = useState<number>(0);

  const passkeyList: Passkey[] = authInfo?.auth?.passkey || [];

  async function addPasskey() {
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
                setAddPasskeyState(1 << 0);
                reload();
              }).catch(err => {
                const error = err.response.data?.message
                switch (error) {
                  case 'Session not found':
                    setAddPasskeyState(1 << 5);
                    break;
                  case 'Identity not found':
                    setAddPasskeyState(1 << 6);
                    break;
                  case 'Register option not found':
                    setAddPasskeyState(1 << 7);
                    break;
                  case 'Authenticator not found':
                    setAddPasskeyState(1 << 8);
                    break;
                  case 'Registration ID already exists':
                    setAddPasskeyState(1 << 9);
                    break;
                  case 'Recaptcha verification failed':
                    setAddPasskeyState(1 << 10);
                    break;
                  default:
                    setAddPasskeyState(1 << 1);
                    console.error(err);
                }
              });
            }).catch(() => {
            setAddPasskeyState(1 << 2);
          });
        }).catch(() => {
        setAddPasskeyState(1 << 3);
      });
    } catch {
      setAddPasskeyState(1 << 4);
    }
  }

  if (authInfo === null) return null;

  return (
    <>
      <p>패스키를 사용하면 디바이스의 지문 인식, 얼굴 인식, 화면 잠금, 혹은 하드웨어 보안키를 사용하여 안전하게 BLINK에 로그인할 수 있습니다. 본인 소유의 디바이스에서만
        패스키를 설정해야 합니다.</p>

      <Stack className={'my-3'}>
        {checkFlag(addPasskeyState, 0) && <Alert variant={'success'}>Passkey를 추가했습니다.</Alert>}
        {checkFlag(addPasskeyState, 1) && <Alert variant={'error'}>Passkey를 추가하지 못했습니다.</Alert>}
        {checkFlag(addPasskeyState, 3) && <Alert variant={'error'}>Passkey 정보를 받아오지 못했습니다.</Alert>}
        {checkFlag(addPasskeyState, 4) && <Alert variant={'error'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</Alert>}
        {checkFlag(addPasskeyState, 5) && <Alert variant={'error'}>Passkey 세션이 만료되었습니다.</Alert>}
        {checkFlag(addPasskeyState, 6) && <Alert variant={'error'}>Passkey를 추가하고자 하는 사용자가 없습니다.</Alert>}
        {checkFlag(addPasskeyState, 7) && <Alert variant={'error'}>Passkey 세션이 만료되었습니다.</Alert>}
        {checkFlag(addPasskeyState, 8) && <Alert variant={'error'}>사용할 수 없는 인증기입니다.</Alert>}
        {checkFlag(addPasskeyState, 9) && <Alert variant={'error'}>인증 ID가 중복되었습니다. 다시 시도해주세요.</Alert>}
        {checkFlag(addPasskeyState, 10) && <Alert variant={'error'}>사용자 보호를 위해 지금은 Passkey를 추가할 수 없습니다.</Alert>}
        <Button className={'w-fit'} onClick={addPasskey}>패스키 등록</Button>
      </Stack>

      {authInfo?.passkey &&
        <FormGroup label={'계정에 등록된 Passkey'} strong>
          <Stack>
            {passkeyList?.map((passkey, index) => (
              <PasskeyRow key={index} passkey={passkey} reload={reload}/>
            ))}
          </Stack>
        </FormGroup>
      }
    </>
  );
}

export default PasskeySettings;
