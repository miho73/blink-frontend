import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import axios from "axios";
import {startAuthentication} from "@simplewebauthn/browser";
import ThemeSelector from "../../css/ThemeSelector.tsx";
import {PasskeyIocnBlack, PasskeyIocnWhite, Svg} from "../../assets/svgs/svg.tsx";
import React from "react";
import startRecaptcha from "../../modules/recaptcha.ts";
import {useNavigate} from "react-router-dom";

function PasskeyAuthentication({errorReporter}: {errorReporter: (error: string) => void}) {
  const {executeRecaptcha} = useGoogleReCaptcha();
  const navigate = useNavigate();

  function authenticate() {
    try {
      const token = startRecaptcha({executeRecaptcha}, 'signin/passkey');
      axios.get('/api/auth/passkey/auth-option')
        .then(res => {
          startAuthentication({
            optionsJSON: res.data['option']
          })
            .then(attestation => {
              axios.post('/api/auth/passkey/login', {
                recaptcha: token,
                attestation: attestation
              }).then(res => {
                const jwt = res.data.jwt;
                navigate(`/auth/complete?jwt=${jwt}`);
              }).catch(() => {
                errorReporter('auth-error');
              });
            }).catch(e => {
            errorReporter('passkey-error');
            console.error(e);
          });
        }).catch(() => {
        errorReporter('passkey-option-error');
      });
    }
    catch {
      errorReporter('recaptcha-not-ready');
    }
  }

  return (
    <LoginButton
      img={
        <ThemeSelector
          light={<Svg src={PasskeyIocnBlack}/>}
          dark={<Svg src={PasskeyIocnWhite}/>}
        />
      }
      text={'Passkey로 로그인'}
      context={'default'}
      onClick={authenticate}
    />
  );
}

interface LoginButtonProps {
  img: React.ReactElement;
  text: string;
  onClick: () => void;
  context: 'default';
}

function LoginButton(props: LoginButtonProps) {
  return (
    <button
      className={
        'relative px-4 py-2 ' +
        'border rounded-lg flex justify-center items-center h-[50px] transition-colors ' +
        'bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800'
      }
      onClick={props.onClick}
    >
      <div className={'absolute left-[12px] top-[3px] w-[40px]'}>
        {props.img}
      </div>
      <p>{props.text}</p>
    </button>
  );
}

export default PasskeyAuthentication;
