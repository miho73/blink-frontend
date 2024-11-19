import {Link} from "react-router-dom";
import {ReactNode} from "react";

interface NavigationButtonProps {
  to: string;
  children: ReactNode;
}

function SchoolNav() {
  return (
    <SmallTab to={'/root/school/db'}>학교 데이터베이스</SmallTab>
  );
}

function SmallTab(props: NavigationButtonProps) {
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
  SchoolNav
}
