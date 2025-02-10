import {Link} from "react-router-dom";
import Stack from "../layout/Stack.tsx";

function NoSvIndex() {
  return (
    <Stack className={'items-center gap-5'}>
      <p className={'text-3xl'}>재학생 확인을 해주세요</p>
      <Stack direction={'row'} className={'divide-x'}>
        <Link to={'/user/student-verification'} className={'href-blue px-3'}>재학생 확인 신청</Link>
        <Link to={'/user/student-verification/check'} className={'href-blue px-3'}>재학생 확인 진행상황</Link>
      </Stack>
    </Stack>
  );
}

export default NoSvIndex;
