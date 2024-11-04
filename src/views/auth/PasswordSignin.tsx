import Stack from "../layout/Stack.tsx";
import {TextInput} from "../form/TextInput.tsx";
import {useState} from "react";
import {Link} from "react-router-dom";
import {Button, ButtonLink} from "../form/Button.tsx";

function PasswordSignin() {
  const [id, setId] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <div
      className={
        'w-full h-full flex flex-col justify-center items-center'
      }
    >
      <p className={'!text-5xl logo'}>BLINK</p>
      <Stack className={'mt-6 min-w-[350px] gap-3'}>
        <TextInput
          placeholder={'ID'}
          size={'md'}
          label={'ID'}
          value={id}
          setter={setId}
        />
        <TextInput
          placeholder={'Password'}
          type={'password'}
          size={'md'}
          label={'Password'}
          value={password}
          setter={setPassword}
        />
      </Stack>
      <Stack direction={'row'} className={'my-3 gap-4'}>
        <ButtonLink to={'/auth'}>다른 방법으로 로그인</ButtonLink>
        <Button>로그인</Button>
      </Stack>
      <Stack direction={'row'} className={'gap-4 text-blue-600 dark:text-blue-400'}>
        <Link to={'/auth/iforgot'} className={'hover:underline'}>암호 찾기</Link>
        <Link to={'/auth/register'} className={'hover:underline'}>회원가입</Link>
      </Stack>
    </div>
  );
}

export default PasswordSignin;
