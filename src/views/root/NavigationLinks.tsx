import {Link} from "react-router-dom";
import {ReactNode} from "react";
import {Svg} from "../../assets/svgs/svg.tsx";

interface NavigationButtonProps {
  to: string;
  children: ReactNode;
}

function SchoolNav() {
  return (
    <SmallTab to={'/root/school/db'}>학교 데이터베이스</SmallTab>
  );
}

function SvNav() {
  return (
    <>
      <SmallTab to={'/root/sv/list'}>재학생 확인 목록</SmallTab>
      <SmallTab to={'/root/sv/approve'}>재학생 확인 승인</SmallTab>
    </>
  )
}

interface NavigationButtonProps {
  to: string;
  children: ReactNode;
  icon: string
}

interface SmallButtonProps {
  to: string;
  children: ReactNode;
}

function NavigationButton(props: NavigationButtonProps) {
  return (
    <Link
      className={
        'transition text-grey-900 hover:bg-grey-200 ' +
        'dark:text-grey-50 dark:hover:bg-grey-800 ' +
        'rounded-r-full text-left ' +
        'flex justify-start items-center ' +
        'whitespace-nowrap'
      }
      to={props.to}
    >
      <Svg src={props.icon} className={'w-[50px] p-[12px]'} css cssColor={'white'}/>
      {props.children}
    </Link>
  );
}

function SmallTab(props: SmallButtonProps) {
  return (
    <Link
      className={
        'transition text-grey-900 hover:bg-grey-200 ' +
        'dark:text-grey-50 dark:hover:bg-grey-800 ' +
        'rounded-lg px-3 py-2 text-left ' +
        'whitespace-nowrap'
      }
      to={props.to}
    >
      {props.children}
    </Link>
  );
}

export {
  NavigationButton,
  SchoolNav,
  SvNav
}
