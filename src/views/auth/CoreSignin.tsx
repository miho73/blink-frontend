import React, {useEffect} from "react";
import Stack from "../layout/Stack.tsx";
import {GoogleIcon, KeyIconBlack, KeyIconWhite, Svg} from "../../assets/svgs/svg.tsx";
import ThemeSelector from "../../css/ThemeSelector.tsx";
import Alert from "../form/Alert.tsx";
import PasskeyAuthentication from "./PasskeyAuthentication.tsx";
import LoginLink from "./LoginLink.tsx";

function CoreSignIn() {
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const e = queryParams.get("error")
    if (e != null) setError(e);
  }, []);

  return (
    <div
      className={
        'w-full h-full flex flex-col justify-center items-center'
      }
    >
      <p className={'!text-5xl logo'}>BLINK</p>

      <Stack className={'my-6 w-[300px] gap-2'}>
        <LoginLink
          img={<Svg src={GoogleIcon}/>}
          text={'Google로 로그인'}
          to={'/api/auth/google/login'}
        />
        <LoginLink
          img={
            <ThemeSelector
              light={<Svg src={KeyIconBlack} className={'p-[4px]'}/>}
              dark={<Svg src={KeyIconWhite} className={'p-[4px]'}/>}
            />
          }
          useLink
          text={'비밀번호로 로그인'}
          to={'/auth/password'}
        />
        <PasskeyAuthentication errorReporter={setError}/>
      </Stack>

      <p className={'w-[400px] text-center text-sm'}>
        <span
          className={'text-caption dark:text-caption-dark'}>This site is protected by reCAPTCHA and the Google </span>
        <a className={'href-blue'} href="https://policies.google.com/privacy">Privacy Policy</a>
        <span className={'text-caption dark:text-caption-dark'}> and </span>
        <a className={'href-blue'} href="https://policies.google.com/terms">Terms of Service</a>
        <span className={'text-caption dark:text-caption-dark'}> apply.</span>
      </p>

      {error === 'state-unset' && <Alert variant={'error'}>state가 설정되지 않았습니다.</Alert>}
      {error === 'state-mismatch' && <Alert variant={'error'}>state가 일치하지 않습니다.</Alert>}
      {error === 'code_unset' && <Alert variant={'error'}>OAuth 응답이 잘못되었습니다.</Alert>}
      {error === 'google_error' && <Alert variant={'error'}>Google로 로그인할 수 없습니다.</Alert>}
      {error === 'internal_server_error' && <Alert variant={'error'}>로그인하지 못했습니다.</Alert>}
      {error === 'recaptcha-error' && <Alert variant={'error'}>사용자 보호를 위해 지금은 로그인할 수 없습니다.</Alert>}
      {error === 'recaptcha-not-ready' && <Alert variant={'error'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</Alert>}
      {error === 'passkey-option-error' && <Alert variant={'error'}>Passkey 인증 정보를 받아오지 못했습니다.</Alert>}
      {error === 'auth-error' && <Alert variant={'error'}>로그인하지 못했습니다.</Alert>}
    </div>
  )
}

//       {error === 'passkey-error' && <Alert variant={'error'}>Passkey로 인증하지 못했습니다.</Alert>}

export default CoreSignIn;
