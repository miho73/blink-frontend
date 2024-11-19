import ProfileIcon from './profile.svg';
import HeartIcon from './heart.svg';
import HomeIcon from './home.svg';
import CompassIcon from './compass.svg';
import MapIcon from './map.svg';
import SettingsIcon from './settings.svg';
import GoogleIcon from './google_logo.svg';
import KakaoIcon from './kakao_logo.svg';
import PencilIcon from './pencil.svg';
import CheckIconLight from './check_light.svg';
import CheckIconDark from './check_dark.svg';
import CancelIconLight from './cancel_light.svg';
import CancelIconDark from './cancel_dark.svg';
import TrashBinIcon from './trash_bin.svg'
import KeyIcon from './key.svg'
import CancelIcon from './x.svg';
import SchoolCapIcon from './school_cap.svg';
import SchoolIcon from './school.svg';

import PasskeyIocnBlack from './FIDO_Passkey_mark_A_black.svg';
import PasskeyIocnWhite from './FIDO_Passkey_mark_A_white.svg';
import KeyIconWhite from './Key_white.svg';
import KeyIconBlack from './Key_black.svg';


interface SVGProps {
  src: string;
  css?: boolean;
  cssColor?: 'white' | 'gray';
  className?: string;
}

function Svg(props: SVGProps) {
  return (
    <img
      src={props.src}
      className={
        (props.className ? props.className : '') +
        (props.css ? (
          (props.cssColor === 'gray' ? ' svg-color-control-gray' : '') +
          (props.cssColor === 'white' ? ' svg-color-control' : '')
        ) : '')
      }
    />
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
  PencilIcon,
  CheckIconLight,
  CheckIconDark,
  CancelIconLight,
  CancelIconDark,
  TrashBinIcon,
  KeyIcon,
  CancelIcon,
  SchoolCapIcon,
  SchoolIcon,

  Svg
};
