import Stack from "../../../layout/Stack.tsx";
import {Button} from "../../../form/Button.tsx";
import {FormGroup} from "../../../form/Form.tsx";
import {PasskeyIocnWhite, PencilIcon, Svg, TrashBinIcon} from "../../../../assets/svgs/svg.tsx";
import {AuthInfo} from "./AuthSettings.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import startRecaptcha from "../../../../modules/recaptcha.ts";
import axios from "axios";
import {startRegistration} from "@simplewebauthn/browser";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import {useState} from "react";
import {checkFlag} from "../../../../modules/formValidator.ts";

function PasskeySettings(
  {authInfo}: {authInfo: AuthInfo}
) {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);
  const {executeRecaptcha} = useGoogleReCaptcha();

  const [addPasskeyState, setAddPasskeyState] = useState<number>(0);

  function addPasskey() {
    startRecaptcha({executeRecaptcha}, 'register/passkey')
      .then(token => {
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
              }).catch(e => {
                setAddPasskeyState(1 << 2);
                console.error(e);
              });
          }).catch(e => {
            setAddPasskeyState(1 << 3);
            console.log(e);
          });
      }).catch(e => {
        setAddPasskeyState(1 << 4);
        console.log(e);
      });
  }

  return (
    <>
      <p>Passkeys를 사용하면 디바이스의 지문 인식, 얼굴 인식, 화면 잠금, 혹은 하드웨어 보안키를 사용하여 안전하게 BLINK에 로그인할 수 있습니다. 본인 소유의 디바이스에서만
        Passkeys를 설정해야 합니다.</p>
      <Stack className={'my-3'}>
        {checkFlag(addPasskeyState, 0) && <p className={'my-2 text-green-500 dark:text-green-300'}>Passkey를 추가했습니다.</p>}
        {checkFlag(addPasskeyState, 1) && <p className={'my-2 text-red-500 dark:text-red-300'}>Passkey를 추가하지 못했습니다.</p>}
        {checkFlag(addPasskeyState, 3) && <p className={'my-2 text-red-500 dark:text-red-300'}>Passkey 정보를 받아오지 못했습니다.</p>}
        {checkFlag(addPasskeyState, 4) && <p className={'my-2 text-red-500 dark:text-red-300'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</p>}
        {checkFlag(addPasskeyState, 5) && <p className={'my-2 text-red-500 dark:text-red-300'}>Passkey 세션이 만료되었습니다.</p>}
        {checkFlag(addPasskeyState, 6) && <p className={'my-2 text-red-500 dark:text-red-300'}>Passkey를 추가하고자 하는 사용자가 없습니다.</p>}
        {checkFlag(addPasskeyState, 7) && <p className={'my-2 text-red-500 dark:text-red-300'}>Passkey 세션이 만료되었습니다.</p>}
        {checkFlag(addPasskeyState, 8) && <p className={'my-2 text-red-500 dark:text-red-300'}>사용할 수 없는 인증기입니다.</p>}
        {checkFlag(addPasskeyState, 9) && <p className={'my-2 text-red-500 dark:text-red-300'}>인증 ID가 중복되었습니다. 다시 시도해주세요.</p>}
        {checkFlag(addPasskeyState, 10) && <p className={'my-2 text-red-500 dark:text-red-300'}>사용자 보호를 위해 지금은 Passkey를 추가할 수 없습니다.</p>}
        <Button size={'custom'} className={'px-5 py-3 w-fit'} onClick={addPasskey}>Passkey 등록</Button>
      </Stack>

      {authInfo?.passkey &&
        <FormGroup label={'계정에 등록된 Passkey'} strong>
          <Stack>
            <Stack direction={'row'}
                   className={'justify-between items-center border border-grey-400 dark:border-grey-600 px-4 py-2 rounded-2xl'}>
              <Stack direction={'row'} className={'gap-2'}>
                <Svg src={PasskeyIocnWhite} className={'w-[64px]'}/>
                <Stack className={'gap-1'}>
                  <p className={'font-medium text-lg md:text-xl'}>Passkey</p>
                  <p className={'text-sm'}>2024년 11월 10일에 생성됨</p>
                  <p className={'text-sm'}>2025년 05월 22일에 마지막으로 사용됨</p>
                </Stack>
              </Stack>
              <Stack direction={'row'} className={'gap-1'}>
                <Button size={'custom'} className={'border-none p-2'}>
                  <Svg src={PencilIcon} className={'w-[32px]'} css cssColor={'white'}/>
                </Button>
                <Button size={'custom'} className={'border-none p-2'}>
                  <Svg src={TrashBinIcon} className={'w-[24px] m-[4px]'} css cssColor={'white'}/>
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </FormGroup>
      }
    </>
  );
}

export default PasskeySettings;
