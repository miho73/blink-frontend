import ProfileIcon from './profile.svg';
import HeartIcon from './heart.svg';
import HomeIcon from './home.svg';
import CompassIcon from './compass.svg';
import MapIcon from './map.svg';
import SettingsIcon from './settings.svg';
import GoogleIcon from './google_logo.svg';
import KakaoIcon from './kakao_logo.svg';
import PasskeyIocnBlack from './FIDO_Passkey_mark_A_black.svg';
import PasskeyIocnWhite from './FIDO_Passkey_mark_A_white.svg';
import KeyIconWhite from './Key_white.svg';
import KeyIconBlack from './Key_black.svg';

interface SVGProps {
  src: string;
  className?: string;
}

function Svg(props: SVGProps) {
  return (
    <img src={props.src} className={(props.className ? props.className : '')}/>
  )
}

export {
  ProfileIcon,
  HeartIcon,
  HomeIcon,
  CompassIcon,
  MapIcon,
  SettingsIcon,
  GoogleIcon,
  KakaoIcon,
  PasskeyIocnBlack,
  PasskeyIocnWhite,
  KeyIconWhite,
  KeyIconBlack,

  Svg
};
