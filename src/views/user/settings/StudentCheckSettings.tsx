import {FormGroup, FormSection} from "../../form/Form.tsx";
import ThemeSelector from "../../../css/ThemeSelector.tsx";
import {CancelIconDark, CancelIconLight, CheckIconDark, CheckIconLight, Svg} from "../../../assets/svgs/svg.tsx";
import Stack from "../../layout/Stack.tsx";
import {Link} from "react-router-dom";
import {Button} from "../../form/Button.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";

function StudentCheckSettings() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    axios.get(
      '/api/sv/get',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      setVerified(res.data?.verified);
    }).catch(() => {

    })
  }, [jwt]);

  return (
    <FormSection title={'재학생 확인'}>
      {verified && <CheckOk/>}
      {!verified && <CheckNotOk/>}
    </FormSection>
  )
}

function CheckOk() {
  return (
    <>
      <Stack direction={'row'} className={'items-center gap-2 mb-3'}>
        <ThemeSelector light={<Svg src={CheckIconLight}/>} dark={<Svg src={CheckIconDark} className={'w-[32px]'}/>}/>
        <p className={'text-lg font-medium text-green-700 dark:text-green-300'}>이 계정은 유리고등학교의 재학생으로 확인되었습니다.</p>
      </Stack>
      <FormGroup label={'학적 확인'} strong>
        <div className={'grid grid-cols-[150px_1fr] border border-grey-400 dark:border-grey-600 px-4 py-1 rounded-lg'}>
          <p className={'py-2 border-b border-grey-400 dark:border-grey-600'}>학교명</p>
          <p className={'py-2 border-b border-grey-400 dark:border-grey-600'}>인하대학교사범대학부속고등학교</p>

          <p className={'py-2'}>학년</p>
          <p className={'py-2'}>2학년</p>
        </div>
        <Button className={'w-fit mt-3'}>재학생 확인 철회</Button>
        <label className={'my-2 text-grey-600 dark:text-grey-400'}>전학, 자퇴, 퇴학 등의 이유로 학적이 변동된 경우 반드시 재학생 확인을 철회하고 필요에 따라
          다시 재학생 확인을 받아야 합니다.</label>
        <ul className={'list-disc pl-8 pr-4 my-1'}>
          <li className={'my-1'}><Link to={'/user/student-verification'}
                                       className={'text-blue-600 dark:text-blue-300 hover:underline'}>재학생
            확인 신청</Link></li>
          <li className={'my-1'}><Link to={'/user/student-verification/check'}
                                       className={'text-blue-600 dark:text-blue-300 hover:underline'}>재학생 확인 결과</Link>
          </li>
        </ul>
      </FormGroup>
    </>
  );
}

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
                                     className={'text-blue-600 dark:text-blue-300 hover:underline'}>재학생 확인 결과</Link>
        </li>
      </ul>
    </>
  );
}

export default StudentCheckSettings;
