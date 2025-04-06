import {FormGroup, FormSection} from "../../../form/Form.tsx";
import Stack from "../../../layout/Stack.tsx";
import {
  GoogleIcon,
  KeyIconBlack,
  KeyIconWhite,
  PasskeyIconBlack,
  PasskeyIconWhite,
  Svg,
} from "../../../../assets/svgs/svg.tsx";
import ThemeSelector from "../../../../css/ThemeSelector.tsx";
import {useEffect, useState} from "react";
import PasswordSettings from "./PasswordSettings.tsx";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import axios from "axios";
import Alert from "../../../form/Alert.tsx";
import PasskeyList from "./PasskeyList.tsx";
import {PageLoadingState} from "../../../../modules/StandardPageFramework.ts";
import {SkeletonElement, SkeletonFrame} from "../../../fragments/Skeleton.tsx";
import AddPasskey from "./AddPasskey.tsx";

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
      passkeyId: string;
    }]
  }
}

function AuthSettings() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [authInfo, setAuthInfo] = useState<AuthInfo>();

  const [pageState, setPageState] = useState<PageLoadingState>(PageLoadingState.LOADING);

  function loadAuthConfig() {
    axios.get(
      '/api/user/auth',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      setAuthInfo(res.data);
      setPageState(PageLoadingState.SUCCESS);
    }).catch(() => {
      setPageState(PageLoadingState.ERROR);
    });
  }

  useEffect(() => {
    loadAuthConfig();
  }, []);

  if (pageState === PageLoadingState.ERROR) {
    return (
      <FormSection title={'인증 및 보안'}>
        <Alert variant={'errorFill'}>인증 정보를 불러오지 못했습니다.</Alert>
      </FormSection>
    )
  }
  else if (pageState === PageLoadingState.SUCCESS || pageState === PageLoadingState.LOADING) {
    return (
      <FormSection title={'인증 및 보안'}>
        <FormGroup label={'인증 방법'} strong>
          { pageState === PageLoadingState.LOADING &&
            <SkeletonFrame>
              <Stack direction={'row'} className={'h-[48px] gap-3'}>
                <SkeletonElement expW={48} expH={48}/>
                <SkeletonElement expW={48} expH={48}/>
                <SkeletonElement expW={48} expH={48}/>
              </Stack>
            </SkeletonFrame>
          }
          { pageState === PageLoadingState.SUCCESS &&
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
                  light={<Svg src={PasskeyIconBlack} alt={'패스키로 로그인'}/>}
                  dark={<Svg src={PasskeyIconWhite} alt={'패스키로 로그인'}/>}
                />
              }
            </Stack>
          }
        </FormGroup>

        {authInfo?.password &&
          <FormGroup label={'비밀번호 변경'} strong>
            <PasswordSettings/>
          </FormGroup>
        }

        <FormGroup label={'Passkey'} strong>
          <AddPasskey reload={loadAuthConfig}/>
          <PasskeyList authInfo={authInfo} reload={loadAuthConfig}/>
        </FormGroup>
      </FormSection>
    );
  }
}

export default AuthSettings;
export type {AuthInfo};
