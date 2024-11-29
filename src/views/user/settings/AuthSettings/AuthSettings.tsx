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
  passkey: boolean;
  auth: {
    google: {
      last_used: string;
    } | null,
    password: {
      last_used: string;
      last_changed: string;
    } | null,
    passkey: {
      keys: [{
        created: string;
        last_used: string;
        key_name: string;
      }]
    }
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
      '/api/user/auth',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      setAuthInfo(res.data);
      setPageState(2);
    }).catch(() => {
      setPageState(1);
    });
  }, [jwt]);

  // TODO: 텍스트 다듬기
  if (pageState === 1) {
    return (
      <FormSection title={'인증 및 보안'}>
        <Alert variant={'error'}>인증 정보를 로딩하지 못했습니다.</Alert>
      </FormSection>
    )
  } else if (pageState === 0 || pageState === 2) {
    return (
      <FormSection title={'인증 및 보안'}>
        <FormGroup label={'인증 방법'} strong>
          <Stack direction={'row'} className={'h-[48px] gap-3 justify-start'}>
            {authInfo?.google &&
              <Svg src={GoogleIcon} className={'w-[48px]'}/>
            }
            {authInfo?.password &&
              <ThemeSelector
                className={'w-[48px]'}
                light={<Svg src={KeyIconBlack}/>}
                dark={<Svg src={KeyIconWhite}/>}
              />
            }
            {authInfo?.passkey &&
              <ThemeSelector
                className={'w-[48px]'}
                light={<Svg src={PasskeyIocnBlack}/>}
                dark={<Svg src={PasskeyIocnWhite}/>}
              />
            }
          </Stack>
        </FormGroup>

        {authInfo?.password &&
          <FormGroup label={'비밀번호 변경'} strong>
            {!pwdChange &&
              <>
                {pwdChangeSuccess && <p className={'text-green-700 dark:text-green-300 mb-3'}>암호가 변경되었습니다.</p>}
                <Button className={'w-fit'} onClick={() => setPwdChange(true)}>비밀번호 변경</Button>
              </>
            }
            {pwdChange && <ChangePassword cancel={() => setPwdChange(false)} success={() => {
              setPwdChange(false);
              setPwdChangeSuccess(true)
            }}/>}
          </FormGroup>
        }

        <FormGroup label={'Passkey 관리'} strong>
          <PasskeySettings authInfo={authInfo}/>
        </FormGroup>
      </FormSection>
    );
  }
}

export default AuthSettings;
export type {AuthInfo};
