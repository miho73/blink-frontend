import {FormGroup, FormSection} from "../../form/Form.tsx";
import Stack from "../../layout/Stack.tsx";
import {
  GoogleIcon,
  KeyIconBlack,
  KeyIconWhite,
  PasskeyIocnBlack,
  PasskeyIocnWhite,
  Svg
} from "../../../assets/svgs/svg.tsx";
import ThemeSelector from "../../../css/ThemeSelector.tsx";
import {Button} from "../../form/Button.tsx";

function AuthSettings() {
  return (
    <FormSection title={'인증 및 보안'}>
      <FormGroup label={'인증 방법'} strong>
        <Stack direction={'row'} className={'h-[48px] gap-3 justify-start'}>
          <Svg src={GoogleIcon} className={'w-[48px]'}/>
          <ThemeSelector
            className={'w-[48px]'}
            light={<Svg src={KeyIconBlack}/>}
            dark={<Svg src={KeyIconWhite}/>}
          />
          <ThemeSelector
            className={'w-[48px]'}
            light={<Svg src={PasskeyIocnBlack}/>}
            dark={<Svg src={PasskeyIocnWhite}/>}
          />
        </Stack>
      </FormGroup>

      <FormGroup label={'비밀번호 변경'} strong>
        <Button className={'w-fit'}>비밀번호 변경</Button>
      </FormGroup>

      <FormGroup label={'Passkey 관리'} strong>
        <p>Passkeys를 사용하면 디바이스의 지문 인식, 얼굴 인식, 화면 잠금, 혹은 하드웨어 보안키를 사용하여 안전하게 IonID에 로그인할 수 있습니다. 본인 소유의 디바이스에서만 Passkeys를 설정해야 합니다.</p>

      </FormGroup>
    </FormSection>
  );
}

export default AuthSettings;
