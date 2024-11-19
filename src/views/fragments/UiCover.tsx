import Stack from "../layout/Stack.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {ReactElement} from "react";
import {useDispatch} from "react-redux";
import {actions} from "../../modules/redux/UserInfoReducer.ts";
import {LinkButton} from "../form/Button.tsx";

function Header() {
  const userInfo = useAppSelector(state => state.userInfoReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let links: ReactElement;

  function signOut() {
    localStorage.removeItem('with-authentication');
    dispatch(actions.signOut());
    navigate('/auth');
  }

  if (userInfo.initialized && userInfo.authenticated) {
    links = (
      <>
        {userInfo.role.includes('blink:admin') && <Link to={'/root'} className={'text-black dark:text-white'}>관리자</Link>}
        <Link to={'/user'} className={'text-black dark:text-white'}>프로필</Link>
        <LinkButton onClick={signOut} className={'text-black dark:text-white'}>로그아웃</LinkButton>
      </>
    );
  } else {
    links = (
      <>
        <Link to={'/auth'} className={'text-black dark:text-white'}>로그인</Link>
        <Link to={'/auth/register'} className={'text-black dark:text-white'}>회원가입</Link>
      </>
    )
  }

  return (
    <header
      className={
        'border-b-2 px-6 py-4 flex items-center justify-between ' +
        'border-grey-300 ' +
        'dark:border-grey-800'
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
        'border-t-2 px-6 py-4 text-sm flex flex-col justify-between ' +
        'border-grey-300 text-grey-600 ' +
        'dark:bg-grey-800 dark:border-grey-600 dark:text-grey-400'
      }
    >
      <Stack direction="row" className={'gap-4'}>
        <Link to="/">블링크 소개</Link>
        <Link to="/docs/eula">이용약관</Link>
        <Link to="/docs/privacy">개인정보 처리방침</Link>
        <Link to="/docs/report">신고 가이드</Link>
      </Stack>
      <p>COPYRIGHT 2024. BLINK. ALL RIGHTS RESERVED.</p>
    </footer>
  )
}

export {
  Header,
  Footer
}
