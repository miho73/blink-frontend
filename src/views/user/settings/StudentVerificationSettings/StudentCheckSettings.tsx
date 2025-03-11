import {FormSection} from "../../../form/Form.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import Alert from "../../../form/Alert.tsx";
import {checkFlag} from "../../../../modules/formValidator.ts";
import StudentVerified from "./StudentVerified.tsx";
import StudentNotVerified from "./StudentNotVerified.tsx";

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
  const [loadState, setLoadState] = useState<number>(0);

  const [verified, setVerified] = useState<boolean>(false);

  useEffect(() => {
    load();
  }, [jwt]);

  function load() {
    axios.get(
      '/api/user/sv',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      setVerified(res.data?.verified);
      if (res.data?.verified) {
        setSchoolData(res.data?.school);
      }
      setLoadState(1 << 0);
    }).catch(e => {
      const error = e.response.data?.message;
      switch (error) {
        case 'Identity not found':
          setLoadState(1 << 1);
          break;
        case 'School information is missing':
          setLoadState(1 << 2);
          break;
        default:
          setLoadState(1 << 3);
          break;
      }
    });
  }

  return (
    <FormSection title={'재학생 확인'}>
      {checkFlag(loadState, 0) &&
        <>
          {verified && <StudentVerified school={schoolData == null ? null : schoolData} reload={load}/>}
          {!verified && <StudentNotVerified/>}
        </>
      }
      {checkFlag(loadState, 1) && <Alert variant={'error'}>사용자를 찾지 못했습니다.</Alert>}
      {checkFlag(loadState, 2) && <Alert variant={'error'}>확인받은 학교가 더이상 존재하지 않습니다.</Alert>}
      {checkFlag(loadState, 3) && <Alert variant={'error'}>재학생 확인 상태를 받아오지 못했습니다.</Alert>}
    </FormSection>
  )
}

export default StudentCheckSettings;
export type {SchoolInfo};
