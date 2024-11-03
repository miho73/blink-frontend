import Stack from "../layout/Stack.tsx";
import {Link} from "react-router-dom";

function Header() {
  return (
    <header
      className={
        'border-b-2 px-6 py-4 flex items-center justify-between ' +
        'border-grey-300 ' +
        'dark:border-grey-800'
      }
    >
      <Link to={'/'} className={'text-black dark:text-white logo'}>BLINK</Link>
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
