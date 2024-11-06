import React, {useEffect} from "react";
import Stack from "../layout/Stack.tsx";
import {
  GoogleIcon,
  KeyIconBlack,
  KeyIconWhite,
  PasskeyIocnBlack,
  PasskeyIocnWhite,
  Svg
} from "../../assets/svgs/svg.tsx";
import {Link} from "react-router-dom";
import ThemeSelector from "../../css/ThemeSelector.tsx";
import Alert from "../form/Alert.tsx";

function CoreSignin() {
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search)
    const e = queryParams.get("error")
    if(e != null) setError(e);
  }, []);

  return (
    <div
      className={
        'w-full h-full flex flex-col justify-center items-center'
      }
    >
      <p className={'!text-5xl logo'}>BLINK</p>

      <Stack className={'mt-6 min-w-[330px] gap-1'}>
        <LoginLink
          img={<Svg src={GoogleIcon}/>}
          text={'Google로 로그인'}
          context={'default'}
          to={'/api/auth/google/web/begin'}
        />
        <LoginLink
          img={
            <ThemeSelector
              light={<Svg src={KeyIconBlack} className={'p-[4px]'}/>}
              dark={<Svg src={KeyIconWhite} className={'p-[4px]'}/>}
            />
          }
          useLink={true}
          text={'비밀번호로 로그인'}
          context={'default'}
          to={'/auth/password'}
        />
        <LoginLink
          img={
            <ThemeSelector
              light={<Svg src={PasskeyIocnBlack}/>}
              dark={<Svg src={PasskeyIocnWhite}/>}
            />
          }
          useLink={true}
          text={'Passkey로 로그인'}
          context={'default'}
          to={'/auth/passkey'}
        />
      </Stack>

      {error === 'state_unset' && <Alert variant={'error'}>state가 설정되지 않았습니다.</Alert>}
      {error === 'state_mismatch' && <Alert variant={'error'}>state가 일치하지 않습니다.</Alert>}
      {error === 'code_unset' && <Alert variant={'error'}>OAuth 응답이 잘못되었습니다.</Alert>}
      {error === 'google_error' && <Alert variant={'error'}>Google로 로그인할 수 없습니다.</Alert>}
      {error === 'internal_server_error' && <Alert variant={'error'}>로그인하지 못했습니다.</Alert>}
    </div>
  )
}

interface LoginLinkProps {
  img: React.ReactElement;
  text: string;
  to: string
  context: 'default';

  useLink?: boolean;
}

const colorClasses: {default: string} = {
  default: 'bg-transparent border-grey-300 text-grey-900 hover:bg-grey-200 hover:border-grey-300 hover:text-black ' +
    'dark:border-grey-800 dark:text-grey-100 dark:hover:bg-grey-800 dark:hover:border-grey-700 dark:hover:text-grey-200',
}

function LoginLink(props: LoginLinkProps) {

  if(props.useLink) {
    return (
      <Link
        className={
          'relative px-4 py-2 border rounded-lg flex justify-center items-center h-[50px] transition-colors ' +
          colorClasses[props.context]
        }
        to={props.to}
      >
        <div className={'absolute left-[12px] top-[3px] w-[40px]'}>
          {props.img}
        </div>
        <p>{props.text}</p>
      </Link>
    );
  }
  else {
    return (
      <a
        className={
          'relative px-4 py-2 border rounded-lg flex justify-center items-center h-[50px] transition-colors ' +
          colorClasses[props.context]
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
