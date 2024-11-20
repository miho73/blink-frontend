import {FormSection} from "../../../form/Form.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAppSelector} from "../../../../modules/hook/ReduxHooks.ts";
import Alert from "../../../form/Alert.tsx";
import {checkFlag} from "../../../../modules/formValidator.ts";
import StudentVerified from "./StudentVerified.tsx";
import StudentNotVerified from "./StudentNotVerified.tsx";

interface SchoolInfo {
  id: number;
  name: string;
  grade: number;
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
      '/api/sv/get',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      setVerified(res.data?.verified);
      if(res.data?.verified) {
        setSchoolData(res.data?.school);
      }
      setLoadState(1 << 0);
    }).catch(() => {
      setLoadState(1 << 1);
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
      {checkFlag(loadState, 1) && <Alert variant={'error'}>재학생 확인 상태를 받아오지 못했습니다.</Alert>}
    </FormSection>
  )
}

export default StudentCheckSettings;
