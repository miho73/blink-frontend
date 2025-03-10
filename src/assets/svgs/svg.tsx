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
import PersonalIcon from './personal.svg';
import StarIcon from './star.svg';
import StarFilledIcon from './star_filled.svg';
import FlameIcon from './flame.svg';

import PasskeyIconBlack from './FIDO_Passkey_mark_A_black.svg';
import PasskeyIconWhite from './FIDO_Passkey_mark_A_white.svg';
import KeyIconWhite from './Key_white.svg';
import KeyIconBlack from './Key_black.svg';


interface SVGProps {
  src: string;
  css?: boolean;
  alt?: string;
  cssColor?: 'white' | 'gray' | 'gold';
  className?: string;
}

function Svg(props: SVGProps) {
  return (
    <img
      src={props.src}
      alt={props.alt}
      className={
        (props.className ? props.className : '') +
        (props.css ? (
          (props.cssColor === 'gray' ? ' svg-color-control-gray' : '') +
          (props.cssColor === 'white' ? ' svg-color-control' : '') +
          (props.cssColor === 'gold' ? ' svg-color-control-yellow' : '')
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
  PasskeyIconBlack,
  PasskeyIconWhite,
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
  PersonalIcon,
  StarIcon,
  StarFilledIcon,
  FlameIcon,

  Svg
};
