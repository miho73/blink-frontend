import {FormSection} from "../../../form/Form.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import StudentVerified from "./StudentVerified.tsx";
import StudentNotVerified from "./StudentNotVerified.tsx";
import {PageLoadingState} from "../../../../modules/StandardPageFramework.ts";
import Alert from "../../../form/Alert.tsx";
import Spinner from "../../../fragments/Spinner.tsx";

interface SchoolInfo {
  schoolUUID: number;
  name: string;
  grade: number;
  classroom: number | null;
  studentNumber: number | null;
}

function StudentCheckSettings() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);
  const [schoolData, setSchoolData] = useState<SchoolInfo>();
  const [pageState, setPageState] = useState<PageLoadingState>(PageLoadingState.LOADING);

  const [verified, setVerified] = useState<boolean>(false);

  function loadStudentInfo() {
    axios.get(
      '/api/user/sv',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      setVerified(res.data?.verified);
      if (res.data?.verified) {
        setSchoolData(res.data?.school);
      }
      setPageState(PageLoadingState.SUCCESS)
    }).catch(() => {
      setPageState(PageLoadingState.ERROR);
    });
  }
  useEffect(() => {
    loadStudentInfo();
  }, []);

  if(pageState === PageLoadingState.LOADING) {
    return (
      <FormSection title={'재학생 확인'}>
        <Spinner/>
      </FormSection>
    );
  }
  else if(pageState === PageLoadingState.ERROR) {
    return (
      <FormSection title={'재학생 확인'}>
        <Alert variant={'errorFill'}>학교 정보를 불러오지 못했습니다.</Alert>
      </FormSection>
    );
  }

  return (
    <FormSection title={'재학생 확인'}>
      <>
        {verified && <StudentVerified school={schoolData == null ? null : schoolData} reload={loadStudentInfo}/>}
        {!verified && <StudentNotVerified/>}
      </>
    </FormSection>
  )
}

export default StudentCheckSettings;
export type {SchoolInfo};
