import {FormGroup, FormSection} from "../../form/Form.tsx";
import Stack from "../../layout/Stack.tsx";
import {
  GoogleIcon,
  KeyIconBlack,
  KeyIconWhite,
  PasskeyIocnBlack,
  PasskeyIocnWhite, PencilIcon,
  Svg, TrashBin
} from "../../../assets/svgs/svg.tsx";
import ThemeSelector from "../../../css/ThemeSelector.tsx";
import {Button} from "../../form/Button.tsx";
import {useState} from "react";
import {ChangePassword} from "./PasswordSettings.tsx";

// TODO: 로딩중 애니메이션 다듬기
function AuthSettings() {
  const [pwdChange, setPwdChange] = useState<boolean>(false);

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
        { !pwdChange && <Button className={'w-fit'} onClick={() => setPwdChange(true)}>비밀번호 변경</Button> }
        { pwdChange && <ChangePassword cancel={() => setPwdChange(false)}/> }
      </FormGroup>

      <FormGroup label={'Passkey 관리'} strong>
        <p>Passkeys를 사용하면 디바이스의 지문 인식, 얼굴 인식, 화면 잠금, 혹은 하드웨어 보안키를 사용하여 안전하게 IonID에 로그인할 수 있습니다. 본인 소유의 디바이스에서만 Passkeys를 설정해야 합니다.</p>
        <Stack direction={'row'} className={'my-3'}>
          <Button size={'custom'} className={'px-5 py-3'}>Passkey 등록</Button>
        </Stack>
        <FormGroup label={'계정에 등록된 Passkey'} strong>
          <Stack>
            <Stack direction={'row'} className={'justify-between items-center border border-grey-400 dark:border-grey-600 px-4 py-2 rounded-2xl'}>
              <Stack direction={'row'} className={'gap-2'}>
                <Svg src={PasskeyIocnWhite} className={'w-[64px]'}/>
                <Stack className={'gap-1'}>
                  <p className={'font-medium text-lg md:text-xl'}>Passkey</p>
                  <p className={'text-sm'}>2024년 11월 10일에 생성됨</p>
                  <p className={'text-sm'}>2025년 05월 22일에 마지막으로 사용됨</p>
                </Stack>
              </Stack>
              <Stack direction={'row'} className={'gap-1'}>
                <Button size={'custom'} className={'border-none p-2'}>
                  <Svg src={PencilIcon} className={'w-[32px]'} css cssColor={'white'}/>
                </Button>
                <Button size={'custom'} className={'border-none p-2'}>
                  <Svg src={TrashBin} className={'w-[24px] m-[4px]'} css cssColor={'white'}/>
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </FormGroup>
      </FormGroup>
    </FormSection>
  );
}

export default AuthSettings;
