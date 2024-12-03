import Stack from "../../../layout/Stack.tsx";
import {Button} from "../../../form/Button.tsx";
import {FormGroup} from "../../../form/Form.tsx";
import {PasskeyIocnBlack, PasskeyIocnWhite, PencilIcon, Svg, TrashBinIcon} from "../../../../assets/svgs/svg.tsx";
import {AuthInfo} from "./AuthSettings.tsx";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import startRecaptcha from "../../../../modules/recaptcha.ts";
import axios from "axios";
import {startRegistration} from "@simplewebauthn/browser";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import {useEffect, useState} from "react";
import {checkFlag} from "../../../../modules/formValidator.ts";
import {ISO8601StringToDate} from "../../../../modules/Datetime.ts";
import ThemeSelector from "../../../../css/ThemeSelector.tsx";
import Dialog from "../../../fragments/Dialog.tsx";

function PasskeySettings(
  {authInfo}: {authInfo: AuthInfo | null}
) {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);
  const {executeRecaptcha} = useGoogleReCaptcha();

  const [addPasskeyState, setAddPasskeyState] = useState<number>(0);

  const passkeyList: Passkey[] = authInfo?.auth?.passkey || [];

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

  if (authInfo === null) return null;

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
            {passkeyList?.map((passkey, index) => (
              <PasskeyRow key={index} passkey={passkey}/>
            ))}
          </Stack>
        </FormGroup>
      }
    </>
  );
}

interface Passkey {
  name: string;
  lastUsed: string;
  createdAt: string;
  aaguid: string;
}

function PasskeyRow({passkey}: {passkey: Passkey}) {
  const [icon, setIcon] = useState<string[]>([]);
  const [deletePasskeyOpen, setDeletePasskeyOpen] = useState<boolean>(false);

  useEffect(() => {
    axios.get('/api/auth/passkey/aaguid/light/'+passkey.aaguid)
      .then(res => {
        setIcon([
          res.data['icon']['light'],
          res.data['icon']['dark']
        ]);
      }).catch(() => {
        setIcon([PasskeyIocnBlack, PasskeyIocnWhite]);
      });
  }, []);
  //TODO: implement delete / rename passkey
  function deletePasskey() {

  }

  return (
    <>
    <Stack direction={'row'}
           className={'justify-between items-center border border-neutral-400 dark:border-neutral-600 px-4 py-2 rounded-2xl'}>
      <ThemeSelector
        light={<Svg src={icon[0]}/>}
        dark={<Svg src={icon[1]}/>}
        className={'w-[48px]'}
      />
      <Stack className={'gap-2'}>
        <p className={'font-medium text-lg md:text-xl'}>{passkey.name}</p>
        <p className={'text-sm'}>{ISO8601StringToDate(passkey.createdAt)}에 생성됨</p>
        <p className={'text-sm'}>{passkey.lastUsed ? `${ISO8601StringToDate(passkey.lastUsed)}에 마지막으로 사용됨` : '아직 사용되지 않음'}</p>
      </Stack>
      <Stack direction={'row'} className={'gap-1'}>
        <Button size={'custom'} className={'border-none p-2'}>
          <Svg src={PencilIcon} className={'w-[32px]'} css cssColor={'white'}/>
        </Button>
        <Button size={'custom'} className={'border-none p-2'} onClick={() => setDeletePasskeyOpen(true)}>
          <Svg src={TrashBinIcon} className={'w-[24px] m-[4px]'} css cssColor={'white'}/>
        </Button>
      </Stack>
    </Stack>
      <Dialog
        title={'Passkey 삭제'}
        open={deletePasskeyOpen}
        close={() => setDeletePasskeyOpen(false)}
        closeByBackdrop={true}
      >
        <p>Passkey "{passkey.name}"을(를) 삭제할까요?</p>
        <p>더이상 이 Passkey로 BLINK에 로그인할 수 없게 됩니다. 기기에 저장된 Passkey는 별도로 삭제해야 합니다.</p>

        <Button onClick={deletePasskey}>삭제</Button>
      </Dialog>
    </>
  )
}

export default PasskeySettings;
