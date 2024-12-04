import {FormGroup, FormSection} from "../../../form/Form.tsx";
import Stack from "../../../layout/Stack.tsx";
import {
  GoogleIcon,
  KeyIconBlack,
  KeyIconWhite,
  PasskeyIocnBlack,
  PasskeyIocnWhite,
  Svg,
} from "../../../../assets/svgs/svg.tsx";
import ThemeSelector from "../../../../css/ThemeSelector.tsx";
import {Button} from "../../../form/Button.tsx";
import {useEffect, useState} from "react";
import {ChangePassword} from "./PasswordSettings.tsx";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import axios from "axios";
import Alert from "../../../form/Alert.tsx";
import PasskeySettings from "./PasskeySettings.tsx";

interface AuthInfo {
  google: boolean;
  password: boolean;
  passkey: number;
  auth: {
    google: {
      last_used: string;
    } | null,
    password: {
      last_used: string;
      last_changed: string;
    } | null,
    passkey: [{
      createdAt: string;
      lastUsed: string;
      name: string;
      aaguid: string;
    }]
  } | null
}

function AuthSettings() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [pwdChangeExpanded, setPwdChangeExpanded] = useState<boolean>(false);
  const [pwdChangeSuccess, setPwdChangeSuccess] = useState<boolean>(false);
  const [pageState, setPageState] = useState<number>(0);

  const [authInfo, setAuthInfo] = useState<AuthInfo>();

  function load() {
    axios.get(
      '/api/user/auth',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      setAuthInfo(res.data);
      setPageState(2);
    }).catch(() => {
      setPageState(1);
    });
  }

  useEffect(() => {
    load();
  }, []);

  if (pageState === 1) {
    return (
      <FormSection title={'인증 및 보안'}>
        <Alert variant={'errorFill'}>인증 정보를 불러오지 못했습니다.</Alert>
      </FormSection>
    )
  } else if (pageState === 0 || pageState === 2) {
    return (
      <FormSection title={'인증 및 보안'}>
        <FormGroup label={'인증 방법'} strong>
          <Stack direction={'row'} className={'h-[48px] gap-3'}>
            {authInfo?.google &&
              <Svg src={GoogleIcon} className={'w-[48px]'} alt={'구글로 로그인'}/>
            }
            {authInfo?.password &&
              <ThemeSelector
                className={'w-[48px]'}
                light={<Svg src={KeyIconBlack} alt={'비밀번호로 로그인'}/>}
                dark={<Svg src={KeyIconWhite} alt={'비밀번호로 로그인'}/>}
              />
            }
            {authInfo?.passkey !== 0 &&
              <ThemeSelector
                className={'w-[48px]'}
                light={<Svg src={PasskeyIocnBlack} alt={'패스키로 로그인'}/>}
                dark={<Svg src={PasskeyIocnWhite} alt={'패스키로 로그인'}/>}
              />
            }
          </Stack>
        </FormGroup>

        {authInfo?.password &&
          <FormGroup label={'비밀번호 변경'} strong>
            {!pwdChangeExpanded &&
              <>
                {pwdChangeSuccess && <Alert variant={'success'}>암호가 변경되었습니다.</Alert>}
                <Button className={'w-fit'} onClick={() => setPwdChangeExpanded(true)}>비밀번호 변경</Button>
              </>
            }
            {pwdChangeExpanded && <ChangePassword cancel={() => setPwdChangeExpanded(false)} success={() => {
              setPwdChangeExpanded(false);
              setPwdChangeSuccess(true);
              load();
            }}/>}
          </FormGroup>
        }

        <FormGroup label={'Passkey 관리'} strong>
          <PasskeySettings authInfo={authInfo} reload={load}/>
        </FormGroup>
      </FormSection>
    );
  }
}

export default AuthSettings;
export type {AuthInfo};
