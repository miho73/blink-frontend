import {Hr} from "../../fragments/Hr.tsx";
import {FormGroup, FormSection} from "../../form/Form.tsx";
import Stack from "../../layout/Stack.tsx";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {checkFlag} from "../../../modules/formValidator.ts";
import {TextInput} from "../../form/TextInput.tsx";
import {Button} from "../../form/Button.tsx";
import axios from "axios";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import {Checkbox} from "../../form/Checkbox.tsx";

interface SvRequest {
  verificationId: number;
  userId: number;
  requestTime: string;
  name: string;
  evidenceType: string;
  docCode: string;
  grade: number;
  state: string;
  schoolName: string;
  nameEucKr: string;
}

interface SchoolType {
  school_id: number | null;
  school_name: string;
  school_type: string;
  neis_code: string;
  address: string;
  sex: string;
}

function SvApprove() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt)

  const [searchParams] = useSearchParams();
  const [verificationId, setVerificationId] = useState<number>();
  const [req, setReq] = useState<SvRequest>();
  const [schoolData, setSchoolData] = useState<SchoolType>();

  const [checkList, setCheckList] = useState<number>(0);
  const [formState, setFormState] = useState<number>(-1);
  const [schoolExists, setSchoolExists] = useState<number>(0);
  const [workingState, setWorkingState] = useState<number>(0);

  const navigate = useNavigate();

  useEffect(() => {
    const viid = searchParams.get('vid');

    if(viid == null) {
      setFormState(1 << 0);
      return;
    }

    const vid = parseInt(viid);
    setVerificationId(vid)
    reload(vid);
  }, []);

  function reload(vid: number) {
    axios.get(
      '/api/sv/approve',
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
        params: {
          vid: vid
        }
      }
    ).then(res => {
      setReq(res.data['data']);
      searchSchoolDb(res.data['data'].schoolName)
    }).catch(err => {
      const error = err.response.data?.message;
      switch (error) {
        case 'Forbidden':
          setFormState(1 << 1);
          break;
        case 'The requested resource could not be found':
          setFormState(1 << 2);
          break;
        case 'vid was not given':
          setFormState(1 << 3);
          break;
        default:
          setFormState(1 << 4);
      }
    });
  }

  function searchSchoolDb(school_name: string) {
    axios.get(
      '/api/school/access',
      {
        params: {schoolName: school_name},
        headers: {Authorization: 'Bearer ' + jwt}
      }
    ).then(res => {
      const list = res.data['data']
      if(list.length === 0) setSchoolExists(1 << 0);
      else if(list.length > 1) setSchoolExists(1 << 1);
      else setSchoolData(list[0])
      setFormState(0);
    }).catch(err => {
      const error = err.response.data?.message;
      switch (error) {
        case 'Forbidden':
          setFormState(1 << 0);
          break;
        case 'School name was not given':
          setFormState(1 << 5);
          break;
        case 'Database integrity':
          setFormState(1 << 6);
          break;
        default:
          setFormState(1 << 7);
          break;
      }
    });
  }

  function setVid() {
    navigate(`/root/sv/approve?vid=${verificationId}`)
    setFormState(-1);
    if (verificationId != null) {
      reload(verificationId)
    }
  }

  if(formState === -1) {
    return (
      <>
        <p className={'text-xl font-bold my-3'}>재학생 확인</p>
        <Hr/>
      </>
    )
  }

  if(checkFlag(formState, 0)) {
    return (
      <>
        <p className={'text-xl font-bold my-3'}>재학생 확인</p>
        <Hr/>
        <FormGroup label={'재학생 확인 신청번호'}>
          <TextInput
            type={'number'}
            placeholder={'신청 번호'}
            label={'신청번호'}
            size={'sm'}
            value={verificationId}
            setter={setVerificationId}
          />
          <Button className={'my-2 w-fit'} size={'sm'} onClick={setVid}>확인</Button>
        </FormGroup>
        <p>재학생 확인 신청 목록은 <Link className={'text-blue-600 dark:text-blue-300 hover:underline'} to={'/root/sv/list'}>이곳</Link>에서 확인하세요.</p>
      </>
    )
  }
  if(
    checkFlag(formState, 1) ||
    checkFlag(formState, 2) ||
    checkFlag(formState, 3) ||
    checkFlag(formState, 4)
  ) {
    return (
      <>
        <p className={'text-xl font-bold my-3'}>재학생 확인</p>
        <Hr/>
        {checkFlag(formState, 1) && <p className={'my-2 text-red-500 dark:text-red-300'}>권한이 거부되었습니다.</p>}
        {checkFlag(formState, 2) && <p className={'my-2 text-red-500 dark:text-red-300'}>재학생 확인 신청이 없습니다.</p>}
        {checkFlag(formState, 3) && <p className={'my-2 text-red-500 dark:text-red-300'}>요청에 신청번호가 없습니다.</p>}
        {checkFlag(formState, 4) && <p className={'my-2 text-red-500 dark:text-red-300'}>재학생 확인 신청을 받아오지 못했습니다.</p>}
        {checkFlag(formState, 5) && <p className={'my-2 text-red-500 dark:text-red-300'}>학교 검색 요청에 학교명이 없습니다.</p>}
        {checkFlag(formState, 6) && <p className={'my-2 text-red-500 dark:text-red-300'}>데이터베이스 무결성이 훼손되었습니다.</p>}
        {checkFlag(formState, 7) && <p className={'my-2 text-red-500 dark:text-red-300'}>데이터베이스에서 학교를 찾지 못했습니다.</p>}
      </>
    )
  }

  function determine(state: number) {
    if(checkList !== 15) {
      setWorkingState(1 << 0);
      return;
    }

    axios.post(
      '/api/sv/approve',
      {
        verification_id: verificationId,
        state: state,
        school_id: schoolData?.school_id ?? null
      },
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(() => {
      setWorkingState(1 << 5);
    }).catch(err => {
      const error = err.response.data?.message;

      switch (error) {
        case 'Forbidden':
          setWorkingState(1 << 1);
          break;
        case 'Request not found':
          setWorkingState(1 << 2);
          break;
        case 'Not requested':
          setWorkingState(1 << 3);
          break
        default:
          setWorkingState(1 << 4);
      }
    })
  }

  const docCode16 = req?.docCode.replaceAll('-', '');

  return (
    <>
      <p className={'text-xl font-bold my-3'}>재학생 확인</p>
      <Hr/>

      <div className={'grid grid-cols-2'}>
        <Stack className={'gap-3'}>
          <FormSection title={'신청 기본 정보'}>
            <div className={'grid grid-cols-2 grid-rows-3 gap-y-1 items-center'}>
              <p>신청번호</p>
              <p>{req?.verificationId}</p>

              <p>신청 계정번호</p>
              <p>{req?.userId}</p>

              <p>신청 시각</p>
              <p>{req?.requestTime}</p>

              <p>상태</p>
              <p>{req?.state}</p>
            </div>
          </FormSection>
          <FormSection title={'신청자 정보'}>
            <div className={'grid grid-cols-2 grid-rows-3 gap-y-1 items-center'}>
              <p>실명</p>
              <Checkbox
                id={'check-name'}
                label={req?.name}
                checked={checkFlag(checkList, 0)}
                setter={x => setCheckList(checkList ^ 1)}
              />

              <p>학교명</p>
              <Checkbox
                id={'check-sname'}
                label={req?.schoolName}
                checked={checkFlag(checkList, 1)}
                setter={x => setCheckList(checkList ^ 2)}
              />

              <p>학년</p>
              <Checkbox
                id={'check-grade'}
                label={req?.grade + '학년'}
                checked={checkFlag(checkList, 2)}
                setter={x => setCheckList(checkList ^ 4)}
              />
              <p></p>
            </div>
          </FormSection>
          <FormSection title={'재학증명서'}>
            <div className={'grid grid-cols-2 grid-rows-1 gap-y-1 items-center'}>
              <p>문서 확인 번호</p>
              <Checkbox
                id={'check-dc'}
                label={req?.docCode}
                checked={checkFlag(checkList, 3)}
                setter={x => setCheckList(checkList ^ 8)}
              />
            </div>
            <Link
              to={`https://www.gov.kr/mw/AA040ConfirmInfo.do?a=AA040ConfirmKeyApp&doc_ref_no=${docCode16}&doc_ref_key=${req?.nameEucKr}&doc_ref_key_element=%BD%C5%C3%BB%C0%CE+%BC%BA%B8%ED%C0%BB+%C0%D4%B7%C2%C7%CF%BC%BC%BF%E4.&pdf_OX=PDF`}
              className={'text-blue-600 dark:text-blue-300 hover:underline my-1'}
              target={'_blank'}
            >정부 문서 확인 센터</Link>
          </FormSection>
        </Stack>
        <iframe
          className={'my-3 w-full h-[400px]'}
          src={`/api/sv/approve/evidence?vid=${verificationId}&jwt=Bearer ${jwt}`}
        />
      </div>

      <FormSection title={'학교'} className={'my-3'}>
        {checkFlag(schoolExists, 0) && <p className={'my-2 text-red-500 dark:text-red-300'}>데이터베이스에 학교가 없습니다. <Link
          className={'text-red-500 dark:text-red-300 hover:underline'}
          to={`/root/school/db?school_name=${req?.schoolName}`} target={"_blank"}>이곳</Link>에서 학교를 추가해주세요.</p>}
        {checkFlag(schoolExists, 1) && <p className={'my-2 text-red-500 dark:text-red-300'}>여러개의 학교가 검색되었습니다. <Link
          className={'text-red-500 dark:text-red-300 hover:underline'}
          to={`/root/school/db?school_name=${req?.schoolName}`} target={"_blank"}>이곳</Link>에서 학교 정보를 확인해주세요.</p>}
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
            <tbody>
            <tr>
              {schoolData?.school_id && <td>{schoolData?.school_id}</td>}
              <td>{schoolData?.school_name}</td>
              <td>{schoolData?.school_type}</td>
              <td>{schoolData?.neis_code}</td>
              <td>{schoolData?.address}</td>
              <td>{schoolData?.sex}</td>
            </tr>
            </tbody>
          </table>
        </div>
      </FormSection>

      <ol className={'my-3'}>
        <li>1. 신청자 정보와 제출된 재학증명서의 일치 여부 확인</li>
        <li>2. 제출된 재학증명서와 작성된 문서확인번호 일치 여부 확인</li>
        <li>3. 데이터베이스 학교명과 재학증명서의 학교명 일치 확인</li>
        <li>4. 승인/거절</li>
      </ol>

      <Stack direction={'row'} className={'gap-2 my-3 flex-wrap'}>
        <Button size={'sm'} onClick={() => determine(3)}>승인</Button>
        <Button size={'sm'} onClick={() => determine(2)}>보류</Button>
        <Button size={'sm'} onClick={() => determine(4)}>거절(유효하지 않은 재학증명서)</Button>
        <Button size={'sm'} onClick={() => determine(5)}>거절(신원 불일치)</Button>
        <Button size={'sm'} onClick={() => determine(6)}>거절(정부 문서 확인 센터와 불일치)</Button>
        <Button size={'sm'} onClick={() => determine(7)}>거절</Button>
      </Stack>

      {checkFlag(workingState, 0) && <p className={'text-red-500 dark:text-red-300'}>체크리스트를 확인해주세요.</p>}
      {checkFlag(workingState, 1) && <p className={'text-red-500 dark:text-red-300'}>권한이 거부되었습니다.</p>}
      {checkFlag(workingState, 2) && <p className={'text-red-500 dark:text-red-300'}>신청을 찾지 못했습니다.</p>}
      {checkFlag(workingState, 3) && <p className={'text-red-500 dark:text-red-300'}>재학생 확인 요청이 REQUESTED 상태가 아닙니다.</p>}
      {checkFlag(workingState, 4) && <p className={'text-red-500 dark:text-red-300'}>결정을 저장하지 못했습니다.</p>}
      {checkFlag(workingState, 5) && <p className={'text-green-500 dark:text-green-300'}>재학생 확인이 결정되었습니다.</p>}
    </>
  )
}

export default SvApprove;
