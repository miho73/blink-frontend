import {Hr} from "../../fragments/Hr.tsx";
import {ReactNode, useState} from "react";
import {ToolBar, ToolBarButton, ToolBarInput} from "../RootComponents.tsx";
import axios from "axios";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import {Link} from "react-router-dom";
import {checkFlag} from "../../../modules/formValidator.ts";
import Alert from "../../form/Alert.tsx";
import {ISO8601StringToDate} from "../../../modules/Datetime.ts";

interface SvRequest {
  verificationId: number;
  userId: number;
  requestTime: string;
  name: string;
  evidence: boolean;
  grade: number;
  state: string;
  schoolName: string;
}

function SvList() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);
  const [data, setData] = useState<SvRequest[]>([]);
  const [name, setName] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('');
  const [pageState, setPageState] = useState<number>(0);

  function getList() {
    axios.get(
      '/api/sv/access',
      {
        headers: {'Authorization': `Bearer ${jwt}`},
        params: {
          name: name,
          schoolName: schoolName
        }
      }
    ).then(res => {
      setData(res.data['data']);
    }).catch(err => {
      const error = err.response.data?.message;
      switch (error) {
        case 'Forbidden':
          setPageState(1);
          break;
        case 'Database integrity':
          setPageState(2);
          break;
        default:
          setPageState(3);
      }
    });
  }

  const rows: ReactNode[] = [];
  data.map((sv, index) => {
    rows.push(
      <tr key={index}>
        <td>
          <Link to={`/root/sv/approve?vid=${sv.verificationId}`} className={'href-blue'}>{sv.verificationId}</Link>
        </td>
        <td>{sv.userId}</td>
        <td>{ISO8601StringToDate(sv.requestTime)}</td>
        <td>{sv.name}</td>
        <td>{sv.evidence ? '제출' : '미제출'}</td>
        <td>{sv.grade}</td>
        <td>
          <Link to={`/root/school/db?schoolName=${sv.schoolName}`} className={'href-blue'} target={'_blank'}>
            {sv.schoolName}
          </Link>
        </td>
        <td>{sv.state}</td>
      </tr>
    );
  })

  return (
    <>
      <p className={'text-xl font-bold my-3'}>재학생 확인</p>
      <Hr/>
      {pageState === 1 && <Alert variant={'error'}>권한이 거부되었습니다.</Alert>}
      {pageState === 2 && <Alert variant={'error'}>데이터베이스 무결성이 훼손되었습니다.</Alert>}
      {pageState === 3 && <Alert variant={'error'}>재학생 확인 신청을 검색하지 못했습니다.</Alert>}
      <ToolBar>
        <ToolBarInput
          placeholder={'실명 Filter'}
          label={'실명 Filter'}
          value={name}
          setter={setName}
          onEnter={getList}
        />
        <ToolBarInput
          placeholder={'학교명 Filter'}
          label={'학교명 Filter'}
          value={schoolName}
          setter={setSchoolName}
          onEnter={getList}
        />

        <ToolBarButton onClick={getList}>로드</ToolBarButton>
      </ToolBar>
      <div className={'table-root'}>
        <table>
          <thead>
          <tr>
            <th>KEY</th>
            <th>사용자 ID</th>
            <th>신청 시각</th>
            <th>실명</th>
            <th>재학증명서</th>
            <th>학년</th>
            <th>학교명</th>
            <th>상태</th>
          </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </>
  );
}

export default SvList;
