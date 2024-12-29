import {Hr} from "../../fragments/Hr.tsx";
import {ReactNode, useEffect, useState} from "react";
import {ToolBar, ToolBarButton, ToolBarInput} from "../RootComponents.tsx";
import axios from "axios";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import {checkFlag} from "../../../modules/formValidator.ts";
import {useSearchParams} from "react-router-dom";
import Alert from "../../form/Alert.tsx";

interface SchoolType {
  schoolId: number | null;
  schoolName: string;
  schoolType: string;
  neisCode: string;
  address: string;
  sex: string;
}

function SchoolManagement() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);
  const [schoolName, setSchoolName] = useState<string>('');
  const [selectedRow, setSelectedRow] = useState<number>(-1);
  const [pageState, setPageState] = useState<number>(0);

  const [schoolData, setSchoolData] = useState<SchoolType[]>([]);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const sname = searchParams.get('schoolName')
    if (sname !== null) {
      setSchoolName(sname);
      searchDb(sname);
    }
  }, []);

  function searchNeis() {
    axios.get(
      '/api/school/neis',
      {
        params: {schoolName: schoolName},
        headers: {Authorization: 'Bearer ' + jwt}
      }
    ).then(res => {
      setSchoolData(res.data['data']);
      setPageState(0);
    }).catch(err => {
      const error = err.response.deta?.message;
      switch (error) {
        case 'Forbidden':
          setPageState(1 << 0);
          break;
        case 'School name was not given':
          setPageState(1 << 1);
          break;
        case 'NEIS API error':
          setPageState(1 << 2);
          break;
        default:
          setPageState(1 << 3);
          break;
      }
    });
  }

  function searchDb(param_school_name?: string) {
    axios.get(
      '/api/school/access',
      {
        params: {schoolName: param_school_name ? param_school_name : schoolName},
        headers: {Authorization: 'Bearer ' + jwt}
      }
    ).then(res => {
      setSchoolData(res.data['data']);
      setPageState(0);
    }).catch(err => {
      const error = err.response.data?.message;
      switch (error) {
        case 'Forbidden':
          setPageState(1 << 0);
          break;
        case 'School name was not given':
          setPageState(1 << 1);
          break;
        case 'Database integrity':
          setPageState(1 << 9);
          break;
        default:
          setPageState(1 << 10);
          break;
      }
    });
  }

  function deleteAll() {
    axios.delete(
      '/api/school/access',
      {
        headers: {
          Authorization: 'Bearer ' + jwt,
          'School-Uid': schoolData[selectedRow].neisCode
        }
      }
    ).then(() => {
      setPageState(1 << 14);
    }).catch(err => {
      const error = err.response.data?.message;
      switch (error) {
        case 'Forbidden':
          setPageState(1 << 0);
          break;
        case 'NEIS code was not given':
          setPageState(1 << 11);
          break;
        case 'School not found':
          setPageState(1 << 12);
          break;
        default:
          setPageState(1 << 13);
          break;
      }
    });
  }

  function addSchool() {
    if (schoolData.length <= selectedRow) {
      setPageState(1 << 4);
      return;
    }
    const school = schoolData[selectedRow];

    axios.post(
      '/api/school/access',
      {
        schoolName: school.schoolName,
        schoolType: school.schoolType,
        neisCode: school.neisCode,
        address: school.address,
        sex: school.sex
      },
      {headers: {Authorization: 'Bearer ' + jwt}}
    ).then(() => {
      setPageState(1 << 7);
    }).catch(err => {
      if (err.status === 400) {
        setPageState(1 << 6);
        return;
      }

      const error = err.response.data?.message;
      switch (error) {
        case 'Forbidden':
          setPageState(1 << 0);
          break;
        case 'School already exists':
          setPageState(1 << 8);
          break;
        default:
          setPageState(1 << 5);
          break;
      }
    });
  }

  const rows: ReactNode[] = [];

  schoolData.map((school, index) => {
    if (index === selectedRow) {
      rows.push(
        <tr
          className={
            'transition cursor-pointer bg-opacity-50 dark:!bg-opacity-50 !bg-blue-600 dark:!bg-blue-300'
          }
          onClick={() => setSelectedRow(index)}
        >
          {school.schoolId && <td>{school.schoolId}</td>}
          {!school.schoolId && <td>N/A</td>}
          <td>{school.schoolName}</td>
          <td>{school.schoolType}</td>
          <td>{school.neisCode}</td>
          <td>{school.address}</td>
          <td>{school.sex}</td>
        </tr>
      );
    } else {
      console.log(school)
      rows.push(
        <tr onClick={() => setSelectedRow(index)} className={'transition cursor-pointer'}>
          {school.schoolId && <td>{school.schoolId}</td>}
          {!school.schoolId && <td>N/A</td>}
          <td>{school.schoolName}</td>
          <td>{school.schoolType}</td>
          <td>{school.neisCode}</td>
          <td>{school.address}</td>
          <td>{school.sex}</td>
        </tr>
      );
    }
  });

  return (
    <>
      <p className={'text-xl font-bold my-3'}>학교 데이터베이스</p>
      <Hr/>
      {checkFlag(pageState, 0) && <Alert variant={'error'}>권한이 거부되었습니다.</Alert>}
      {checkFlag(pageState, 1) && <Alert variant={'error'}>학교명이 주어지지 않았습니다.</Alert>}
      {checkFlag(pageState, 2) && <Alert variant={'error'}>NEIS API를 정상적으로 호출하지 못했습니다.</Alert>}
      {checkFlag(pageState, 3) && <Alert variant={'error'}>학교 정보를 NEIS에서 받아오지 못했습니다.</Alert>}
      {checkFlag(pageState, 4) && <Alert variant={'error'}>추가할 학교를 선택해주세요.</Alert>}
      {checkFlag(pageState, 5) && <Alert variant={'error'}>학교를 추가하지 못했습니다.</Alert>}
      {checkFlag(pageState, 6) && <Alert variant={'error'}>학교 정보가 잘못되었습니다.</Alert>}
      {checkFlag(pageState, 7) && <Alert variant={'success'}>학교를 추가했습니다.</Alert>}
      {checkFlag(pageState, 8) && <Alert variant={'error'}>해당 학교가 이미 데이터베이스에 저장되어있습니다.</Alert>}
      {checkFlag(pageState, 9) && <Alert variant={'error'}>데이터베이스 무결성이 훼손되었습니다.</Alert>}
      {checkFlag(pageState, 10) && <Alert variant={'error'}>데이터베이스에서 학교를 검색하지 못했습니다.</Alert>}
      {checkFlag(pageState, 11) && <Alert variant={'error'}>삭제 요청에 NEIS 코드가 없습니다.</Alert>}
      {checkFlag(pageState, 12) && <Alert variant={'error'}>삭제할 학교가 존재하지 않습니다.</Alert>}
      {checkFlag(pageState, 13) && <Alert variant={'error'}>학교를 삭제하지 못했습니다.</Alert>}
      {checkFlag(pageState, 14) && <Alert variant={'success'}>학교를 삭제했습니다.</Alert>}
      <ToolBar>
        <ToolBarInput
          placeholder={'학교명'}
          value={schoolName}
          setter={setSchoolName}
          onEnter={searchNeis}
          onMetaEnter={searchDb}
        />
        <ToolBarButton onClick={searchNeis}>검색</ToolBarButton>
        <ToolBarButton onClick={() => searchDb(schoolName)}>데이터베이스 검색</ToolBarButton>
        <ToolBarButton onClick={addSchool}>추가</ToolBarButton>
        <ToolBarButton onClick={deleteAll}>삭제</ToolBarButton>
      </ToolBar>
      <div className={'table-root'}>
        <table>
          <thead>
          <tr>
            <th>KEY</th>
            <th>학교명</th>
            <th>학교급</th>
            <th>NEIS 코드</th>
            <th>주소</th>
            <th>성별</th>
          </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    </>
  );
}

export default SchoolManagement;
