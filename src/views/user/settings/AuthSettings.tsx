import {FormGroup, FormSection} from "../../form/Form.tsx";
import Stack from "../../layout/Stack.tsx";
import {
  GoogleIcon,
  KeyIconBlack,
  KeyIconWhite,
  PasskeyIocnBlack,
  PasskeyIocnWhite, PencilIcon,
  Svg, TrashBinIcon
} from "../../../assets/svgs/svg.tsx";
import ThemeSelector from "../../../css/ThemeSelector.tsx";
import {Button} from "../../form/Button.tsx";
import {useEffect, useState} from "react";
import {ChangePassword} from "./PasswordSettings.tsx";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import axios from "axios";
import Alert from "../../form/Alert.tsx";

interface AuthInfo {
  google: boolean;
  password: boolean;
  passkey: boolean;
  auth: {
    google: {
      last_used: string;
    } | null,
    password: {
      last_used: string;
      last_changed: string;
    } | null
  }
}

// TODO: 로딩중 애니메이션 다듬기
function AuthSettings() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [pwdChange, setPwdChange] = useState<boolean>(false);
  const [pwdChangeSuccess, setPwdChangeSuccess] = useState<boolean>(false);
  const [pageState, setPageState] = useState<number>(0);

  const [authInfo, setAuthInfo] = useState<AuthInfo>();

  useEffect(() => {
    axios.get(
      '/api/user/auth/get',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      setAuthInfo(res.data);
      setPageState(2);
    }).catch(() => {
      setPageState(1);
    });
  }, [jwt]);

  // TODO: 텍스트 다듬기
  if(pageState === 1) {
    return (
      <FormSection title={'인증 및 보안'}>
        <Alert variant={'error'}>인증 정보를 로딩하지 못했습니다.</Alert>
      </FormSection>
    )
  }
  else if(pageState === 0 || pageState === 2) {
    return (
      <FormSection title={'인증 및 보안'}>
        <FormGroup label={'인증 방법'} strong>
          <Stack direction={'row'} className={'h-[48px] gap-3 justify-start'}>
            { authInfo?.google &&
              <Svg src={GoogleIcon} className={'w-[48px]'}/>
            }
            { authInfo?.password &&
              <ThemeSelector
                className={'w-[48px]'}
                light={<Svg src={KeyIconBlack}/>}
                dark={<Svg src={KeyIconWhite}/>}
              />
            }
            { authInfo?.passkey &&
              <ThemeSelector
                className={'w-[48px]'}
                light={<Svg src={PasskeyIocnBlack}/>}
                dark={<Svg src={PasskeyIocnWhite}/>}
              />
            }
          </Stack>
        </FormGroup>

        { authInfo?.password &&
          <FormGroup label={'비밀번호 변경'} strong>
            { !pwdChange &&
              <>
                {pwdChangeSuccess && <p className={'text-green-700 dark:text-green-300 mb-3'}>암호가 변경되었습니다.</p>}
                <Button className={'w-fit'} onClick={() => setPwdChange(true)}>비밀번호 변경</Button>
              </>
            }
            { pwdChange && <ChangePassword cancel={() => setPwdChange(false)} success={() => {setPwdChange(false); setPwdChangeSuccess(true)}}/> }
          </FormGroup>
        }

        <FormGroup label={'Passkey 관리'} strong>
          <p>Passkeys를 사용하면 디바이스의 지문 인식, 얼굴 인식, 화면 잠금, 혹은 하드웨어 보안키를 사용하여 안전하게 IonID에 로그인할 수 있습니다. 본인 소유의 디바이스에서만 Passkeys를 설정해야 합니다.</p>
          <Stack direction={'row'} className={'my-3'}>
            <Button size={'custom'} className={'px-5 py-3'}>Passkey 등록</Button>
          </Stack>

          { authInfo?.passkey &&
            <FormGroup label={'계정에 등록된 Passkey'} strong>
              <Stack>
                <Stack direction={'row'} className={'justify-between items-center border border-grey-400 dark:border-grey-600 px-4 py-2 rounded-2xl'}>
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
        </FormGroup>
      </FormSection>
    );
  }
}

export default AuthSettings;
