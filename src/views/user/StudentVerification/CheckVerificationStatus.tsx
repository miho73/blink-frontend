import Stack from "../../layout/Stack.tsx";
import {Hr} from "../../fragments/Hr.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import {checkFlag} from "../../../modules/formValidator.ts";
import Alert from "../../form/Alert.tsx";
import {Link} from "react-router-dom";
import VerificationRequestRow from "./VerificationRequestRow.tsx";

interface SvRequest {
  vid: number;
  docCode: string;
  evidenceType: number;
  examinedAt: string | null;
  requestedAt: string;
  grade: number;
  name: string;
  school: string;
  state: number;
}

function CheckVerificationStatus() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [requests, setRequests] = useState<SvRequest[]>([]);
  const [formState, setFormState] = useState<number>(0);

  function reload() {
    axios.get(
      '/api/sv/user/requests',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      if(res.data.requests.length === 0) {
        setFormState(1 << 1);
      }
      else setRequests(res.data.requests);
    }).catch(() => {
      setFormState(1 << 0);
    });
  }

  useEffect(() => {
    axios.get(
      '/api/sv/user/requests',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      if(res.data.requests.length === 0) {
        setFormState(1 << 1);
      }
      else setRequests(res.data.requests);
    }).catch(() => {
      setFormState(1 << 0);
    });
  }, [jwt]);


  return (
    <div className={'w-full px-5 sm:w-3/4 lg:w-1/2 pt-3 mx-auto'}>
      <Stack direction={'row'} className={'gap-4'}>
        <p className={'!text-5xl logo'}>BLINK</p>
        <p className={'text-2xl font-bold my-3'}>재학생 확인 조회</p>
      </Stack>
      <Hr/>
      {formState === 0 &&
        <div className={'table-root'}>
          <table className={'no-stripe'}>
            <thead>
            <tr>
              <th>상태</th>
              <th>신청 시각</th>
              <th>신청 정보</th>
            </tr>
            </thead>
            <tbody>
            {requests.map((req, idx) => {
              return (
                <VerificationRequestRow key={idx} {...req} reload={reload}/>
              )
            })}
            </tbody>
          </table>
        </div>
      }
      {checkFlag(formState, 1) &&
        <Alert variant={'infoFill'}>
          <p className={'text-inherit'}>아직 재학생 확인 신청 내역이 없습니다.</p>
          <p className={'text-inherit'}>새 신청은 <Link className={'text-blue-600 hover:underline'} to={'/user/student-verification'}>이곳</Link>에서 제출할 수 있습니다.</p>
        </Alert>
      }
      {checkFlag(formState, 0) &&
        <Alert variant={'error'}>재학생 확인 내역을 로딩하지 못했습니다.</Alert>
      }
    </div>
  );
}

export default CheckVerificationStatus;
export type { SvRequest };
