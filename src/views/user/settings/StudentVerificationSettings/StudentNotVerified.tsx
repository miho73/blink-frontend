import Stack from "../../../layout/Stack.tsx";
import ThemeSelector from "../../../../css/ThemeSelector.tsx";
import {CancelIconDark, CancelIconLight, Svg} from "../../../../assets/svgs/svg.tsx";
import {Link} from "react-router-dom";

function CheckNotOk() {
  return (
    <>
      <Stack direction={'row'} className={'items-center gap-2 mb-3'}>
        <ThemeSelector light={<Svg src={CancelIconLight}/>} dark={<Svg src={CancelIconDark} className={'w-[32px]'}/>}/>
        <p className={'text-lg font-medium text-red-600 dark:text-red-300'}>이 계정은 아직 재학생 확인을 받지 않았습니다.</p>
      </Stack>
      <p>BLINK의 모든 기능을 이용하려면 재학생 확인을 받아야 합니다.</p>
      <ul className={'list-disc pl-8 pr-4 py-3'}>
        <li className={'my-1'}><Link to={'/user/student-verification'}
                                     className={'text-blue-600 dark:text-blue-300 hover:underline'}>재학생
          확인 신청</Link></li>
        <li className={'my-1'}><Link to={'/user/student-verification/check'}
                                     className={'text-blue-600 dark:text-blue-300 hover:underline'}>재학생 확인 조회</Link>
        </li>
      </ul>
    </>
  );
}

export default CheckNotOk;
