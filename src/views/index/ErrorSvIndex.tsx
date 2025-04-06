import {Link} from "react-router-dom";
import Stack from "../layout/Stack.tsx";

function ErrorSvIndex() {
  return (
    <Stack className={'items-center gap-5'}>
      <p className={'text-3xl'}>문제가 생겼습니다.</p>
      <p>재학생 확인 상태를 확인하지 못했습니다.</p>
      <Stack direction={'row'} className={'divide-x'}>
        <Link to={'/user/student-verification'} className={'href-blue px-3'}>재학생 확인 신청</Link>
        <Link to={'/user/student-verification/check'} className={'href-blue px-3'}>재학생 확인 진행상황</Link>
      </Stack>
    </Stack>
  );
}

export default ErrorSvIndex;
