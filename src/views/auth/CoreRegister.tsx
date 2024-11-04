import Stack from "../layout/Stack.tsx";
import {Button, ButtonLink} from "../form/Button.tsx";
import {Checkbox} from "../form/Checkbox.tsx";
import {TextInput} from "../form/TextInput.tsx";
import {FormGroup, FormSection} from "../form/Form.tsx";
import {Hr} from "../fragments/Hr.tsx";
import {Link} from "react-router-dom";

function CoreRegister() {
  return (
    <div className={'w-full px-5 sm:w-3/4 lg:w-1/2 pt-3 mx-auto'}>
      <Stack direction={'row'} className={'gap-4'}>
        <p className={'!text-5xl logo'}>BLINK</p>
        <p className={'text-2xl font-bold my-3'}>회원가입</p>
      </Stack>

      <Hr/>

      <Stack className={'gap-4'}>
        <FormSection title={'기본 정보'}>
          <FormGroup label={'이름'}>
            <TextInput placeholder={'이름'} size={'sm'} label={'이름'}/>
          </FormGroup>
        </FormSection>

        <FormSection title={'약관 및 확인사항'}>
          <Stack className={'border border-grey-400 dark:border-grey-600 px-4 py-3 gap-2'}>
            <Link to={'/docs/eula'}>BLINK 이용약관 &gt;</Link>
            <Link to={'/docs/privacy'}>BLINK 개인정보 처리방침 &gt;</Link>
          </Stack>
          <Checkbox id={'eula-agree'} label={'이상의 내용을 모두 이해했고, 동의합니다.'}/>
        </FormSection>

        <FormSection title={'BLINK 재학 확인에 관한 사항'}>
          <ul className={'list-outside list-disc border border-grey-400 dark:border-grey-600 pl-8 pr-4 py-3'}>
            <li className={'my-1'}>BLINK 서비스는 서비스 이용 당시 대한민국의 중등교육기관(중학교 및 고등학교)에 재학중인 학생만 이용 가능합니다.</li>
            <li className={'my-1'}>BLINK 서비스를 사용하려면 BLINK 계정을 만든 후 재학 확인을 받아야 합니다.</li>
            <li className={'my-1'}>계정이 만들어진 후 1년간 재학 확인이 이루어지지 않은 계정은 임의로 삭제될 수 있습니다.</li>
          </ul>
          <Checkbox id={'student-verify'} label={'위의 내용을 모두 확인했습니다.'}/>
        </FormSection>
      </Stack>

      <Stack direction={'row'} className={'my-4 gap-4'}>
        <ButtonLink to={'/auth'}>기존 계정으로 로그인</ButtonLink>
        <Button>회원가입</Button>
      </Stack>
    </div>
  )
}

export default CoreRegister;
