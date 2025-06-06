import Stack from "../layout/Stack.tsx";
import {Link} from "react-router-dom";
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {ReactElement} from "react";

function Header() {
  const userInfo = useAppSelector(state => state.userInfoReducer);

  let links: ReactElement;

  if (userInfo.initialized && userInfo.authenticated) {
    links = (
      <>
        {userInfo.role.includes('root:access') && <Link to={'/root'} className={'href-none'}>관리자</Link>}
        <Link to={'/user/settings'} className={'href-none'}>프로필</Link>
      </>
    );
  } else {
    links = (
      <>
        <Link to={'/auth'} className={'href-none'}>로그인</Link>
        <Link to={'/auth/register'} className={'href-none'}>회원가입</Link>
      </>
    )
  }

  return (
    <header
      className={
        'border-b dark:border-b-2 px-6 py-4 ' +
        'flex items-center justify-between ' +
        'border-neutral-300 dark:border-neutral-800'
      }
    >
      <Link to={'/'} className={'logo'}>BLINK</Link>
      <Stack direction={'row'} className={'gap-4'}>
        {links}
      </Stack>
    </header>
  )
}

function Footer() {
  return (
    <footer
      className={
        'border-t dark:border-t-2 px-6 py-4 ' +
        'flex flex-col justify-between text-sm ' +
        'border-neutral-300 dark:border-neutral-800 ' +
        'dark:bg-neutral-800'
      }
    >
      <Stack direction="row" className={'gap-4'}>
        <Link className={'text-neutral-600 dark:text-neutral-300'} to="/">블링크 소개</Link>
        <Link className={'text-neutral-600 dark:text-neutral-300'} to="/docs/eula">이용약관</Link>
        <Link className={'text-neutral-600 dark:text-neutral-300'} to="/docs/privacy">개인정보 처리방침</Link>
        <Link className={'text-neutral-600 dark:text-neutral-300'} to="/docs/report">신고 가이드</Link>
      </Stack>
      <p className={'text-neutral-600 dark:text-neutral-300'}>COPYRIGHT 2024. BLINK. ALL RIGHTS RESERVED.</p>
    </footer>
  )
}

export {
  Header,
  Footer
}
