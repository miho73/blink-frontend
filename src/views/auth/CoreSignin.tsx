import React, {useEffect} from "react";
import Stack from "../layout/Stack.tsx";
import {
  GoogleIcon,
  KeyIconBlack,
  KeyIconWhite,
  Svg
} from "../../assets/svgs/svg.tsx";
import {Link} from "react-router-dom";
import ThemeSelector from "../../css/ThemeSelector.tsx";
import Alert from "../form/Alert.tsx";
import PasskeyAuthentication from "./PasskeyAuthentication.tsx";

function CoreSignin() {
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

      <Stack className={'my-6 min-w-[330px] gap-1'}>
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

      <p className={'w-[400px] text-center'}>
        <span>This site is protected by reCAPTCHA and the Google </span>
        <a href="https://policies.google.com/privacy">Privacy Policy</a>
        <span> and </span>
        <a href="https://policies.google.com/terms">Terms of Service</a>
        <span> apply.</span>
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
interface LoginLinkProps {
  img: React.ReactElement;
  text: string;
  to?: string
  onClick?: () => void;

  useLink?: boolean;
}

function LoginLink(props: LoginLinkProps) {
  if (props.useLink) {
    return (
      <Link
        className={
          'relative px-4 py-2 border rounded-lg flex justify-center items-center h-[50px] transition-colors ' +
          'bg-transparent border-neutral-300 text-neutral-900 hover:bg-neutral-200 hover:border-neutral-300 hover:text-black ' +
          'dark:border-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:border-neutral-700 dark:hover:text-neutral-200'
        }
        to={props.to ? props.to : '/'}
      >
        <div className={'absolute left-[12px] top-[3px] w-[40px]'}>
          {props.img}
        </div>
        <p>{props.text}</p>
      </Link>
    );
  } else {
    return (
      <a
        className={
          'relative px-4 py-2 border rounded-lg flex justify-center items-center h-[50px] transition-colors ' +
          'bg-transparent border-neutral-300 text-neutral-900 hover:bg-neutral-200 hover:border-neutral-300 hover:text-black ' +
          'dark:border-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:hover:border-neutral-700 dark:hover:text-neutral-200'
        }
        href={props.to}
      >
        <div className={'absolute left-[12px] top-[3px] w-[40px]'}>
          {props.img}
        </div>
        <p>{props.text}</p>
      </a>
    );
  }
}

export default CoreSignin;
