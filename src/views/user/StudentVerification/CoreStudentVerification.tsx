import Stack from "../../layout/Stack.tsx";
import {Hr} from "../../fragments/Hr.tsx";
import {FormGroup, FormSection} from "../../form/Form.tsx";
import {RadioButton} from "../../form/Checkbox.tsx";
import {TextInput} from "../../form/TextInput.tsx";
import {Link} from "react-router-dom";
import {Button} from "../../form/Button.tsx";
import {useState} from "react";
import prettyBytes from "pretty-bytes";
import Select from "../../form/Select.tsx";
import {assertNotValue, checkFlag, lengthCheck, rangeCheck, verifyAll} from "../../../modules/formValidator.ts";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import axios from "axios";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import startRecaptcha from "../../../modules/recaptcha.ts";
import Alert from "../../form/Alert.tsx";

function CoreStudentVerification() {
  const {executeRecaptcha} = useGoogleReCaptcha();
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [name, setName] = useState<string>('');
  const [schoolName, setSchoolName] = useState<string>('')
  const [grade, setGrade] = useState<string>('1');
  const [docCodeA, setDocCodeA] = useState<string>('');
  const [docCodeB, setDocCodeB] = useState<string>('');
  const [docCodeC, setDocCodeC] = useState<string>('');
  const [docCodeD, setDocCodeD] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [formState, setFormState] = useState<number>(0);
  const [working, setWorking] = useState<boolean>(false);

  function validateForm() {
    setWorking(true);
    verifyAll(
      completeSubmit,
      whenFormInvalid,

      lengthCheck(name, 1, 20, 0),
      lengthCheck(schoolName, 1, 50, 1),
      rangeCheck(parseInt(grade), 1, 3, 2),

      lengthCheck(docCodeA, 4, 4, 3),
      lengthCheck(docCodeB, 4, 4, 3),
      lengthCheck(docCodeC, 4, 4, 3),
      lengthCheck(docCodeD, 4, 4, 3),

      assertNotValue<File>(selectedFile, null, 4)
    )
  }

  async function completeSubmit() {
    try {
      const token = await startRecaptcha({executeRecaptcha}, 'sv/new');
      axios.post(
        '/api/sv/draft',
        {
          name: name,
          school_name: schoolName,
          grade: parseInt(grade),
          doc_code: `${docCodeA}-${docCodeB}-${docCodeC}-${docCodeD}`,
          recaptcha: token
        },
        {headers: {'Authorization': `Bearer ${jwt}`}}
      ).then(() => {
        uploadFile();
      }).catch(err => {
        const error = err.response.data?.message;
        switch (error) {
          case 'Identity not found':
            setFormState(1 << 6);
            setWorking(false);
            break;
          case 'Already requested':
            setFormState(1 << 7);
            setWorking(false);
            break;
          case 'Recaptcha failed':
            setFormState(1 << 8);
            setWorking(false);
            break;
          case 'Upload evidence':
            uploadFile();
            break;
          default:
            setFormState(1 << 9);
            setWorking(false);
        }
      });
    } catch {
      setFormState(1 << 5);
      setWorking(false);
    }
  }

  function whenFormInvalid(flag: number) {
    setFormState(flag);
    setWorking(false);
  }

  function uploadFile() {
    const formData = new FormData();
    formData.append('evidence', selectedFile as Blob);

    axios.post(
      '/api/sv/evidence',
      formData,
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(() => {
      setFormState(1 << 14);
    }).catch(err => {
      const error = err.response.data?.message;
      switch (error) {
        case 'Identity not found':
          setFormState(1 << 6);
          break;
        case 'Invalid file type':
          setFormState(1 << 10);
          break;
        case 'File too large':
          setFormState(1 << 11);
          break;
        case 'No draft found':
          setFormState(1 << 12);
          break;
        default:
          setFormState(1 << 13);
      }
    }).finally(() => {
      setWorking(false);
    });
  }

  return (
    <div className={'w-full px-5 sm:w-3/4 lg:w-1/2 pt-3 mx-auto'}>
      <Stack direction={'row'} className={'gap-4'}>
        <p className={'!text-5xl logo'}>BLINK</p>
        <p className={'text-2xl font-bold my-3'}>재학생 확인</p>
      </Stack>
      <Hr/>

      <Stack className={'gap-4'}>
        <p>재학생 확인 신청을 제출합니다. 기존에 제출한 재학생 확인의 진행상황은 <Link className={'href-blue'}
                                                         to={'/user/student-verification/check'}>이곳</Link>에서 확인할 수 있습니다.
        </p>

        <FormSection title={'재학생 확인 방법'}>
          <Stack direction={'row'}>
            <RadioButton
              id={'ver-method'}
              label={'재학증명서 제출'}
              checked={true}
              disabled={working}
            />
          </Stack>
          <p>재학증명서와 학적에 관한 정보를 제출하여 재학생 신분을 확인하는 방법입니다. 재학증명서는 <Link
            className={'href-blue'}
            to={'https://www.gov.kr/mw/AA020InfoCappView.do?HighCtgCD=A04007;A04001&CappBizCD=13410000017&tp_seq=01'}
            target={'_blank'}>정부 24</Link>에서 PDF로 방급받을 수 있습니다.</p>
        </FormSection>

        <FormSection title={'개인정보 입력'}>
          <p>이하의 개인정보는 재학증명서와 일치해야 합니다. 그렇지 않을 경우 재학생 확인이 거절될 수 있습니다.</p>
          <FormGroup label={'실명'}>
            <TextInput
              placeholder={'실명'}
              label={'실명'}
              value={name}
              setter={setName}
              disabled={working}
              invalid={checkFlag(formState, 0)}
              error={'이름은 20자 이하여야 합니다.'}
              authComplete={'name'}
            />
          </FormGroup>
          <FormGroup label={'재학중인 학교 이름'}>
            <TextInput
              placeholder={'재학중인 학교'}
              label={'재학중인 학교'}
              value={schoolName}
              setter={setSchoolName}
              disabled={working}
              invalid={checkFlag(formState, 1)}
              error={'학교 이름은 50자 이하여야 합니다.'}
            />
          </FormGroup>
          <FormGroup label={'학년'}>
            <Select
              options={['1학년', '2학년', '3학년']}
              id={['1', '2', '3']}
              className={'max-w-[200px]'}
              onChange={(val) => setGrade(val)}
              disabled={working}
              value={grade}
              invalid={checkFlag(formState, 2)}
              error={'학년을 정확히 선택해주세요.'}
            />
          </FormGroup>
          <FormGroup label={'문서확인번호'}>
            <Stack direction={'row'}>
              <TextInput
                className={'w-1/5 text-center max-w-[80px]'}
                type={'number'}
                value={docCodeA}
                setter={setDocCodeA}
                disabled={working}
                invalid={checkFlag(formState, 3)}
              />
              <span className={'mx-2 my-1'}>&ndash;</span>
              <TextInput
                className={'w-1/5 text-center max-w-[80px]'}
                type={'number'}
                value={docCodeB}
                setter={setDocCodeB}
                disabled={working}
                invalid={checkFlag(formState, 3)}
              />
              <span className={'mx-2 my-1'}>&ndash;</span>
              <TextInput
                className={'w-1/5 text-center max-w-[80px]'}
                type={'number'}
                value={docCodeC}
                setter={setDocCodeC}
                disabled={working}
                invalid={checkFlag(formState, 3)}
              />
              <span className={'mx-2 my-1'}>&ndash;</span>
              <TextInput
                className={'w-1/5 text-center max-w-[80px]'}
                type={'number'}
                value={docCodeD}
                setter={setDocCodeD}
                disabled={working}
                invalid={checkFlag(formState, 3)}
              />
            </Stack>

            <p className={'text-caption dark:text-caption-dark text-sm mt-2'}>문서확인번호는 재학증명서 상단의 하이픈으로 구분된 16자리
              숫자입니다.</p>
            {checkFlag(formState, 3) && <Alert variant={'error'}>올바른 문서확인번호를 입력해주세요.</Alert>}
          </FormGroup>
        </FormSection>
        <FormSection title={'재학증명서 제출'}>
          <ol className={'list-disc pl-8 pr-4 py-3 border border-neutral-400 dark:border-neutral-600 rounded-lg my-2'}>
            <li className={'my-1'}>재학증명서는 발급받은지 1개월 이내여야 합니다.</li>
            <li className={'my-1'}>재학증명서는 국문(한국어)로 발급받아야 합니다.</li>
            <li className={'my-1'}>재학증명서에 사진과 주민번호 뒷자리를 포함하지 말아야 합니다.</li>
            <li className={'my-1'}>출력된 재학증명서를 스캔/촬영하여 업로드하면 식별이 곤란하여 확인이 거절될 수 있습니다. 가급적 PDF로 다운받아 그대로 제출해주세요.</li>
            <li className={'my-1'}>재학증명서 파일은 1MB 이하여야 합니다.</li>
          </ol>
          <Stack direction={'row'} className={'gap-3 items-center'}>
            <label
              htmlFor={'file-upload'}
              className={
                'border rounded-xl transition block w-fit outline-none button  ' +
                'bg-transparent border-neutral-400 hover:bg-neutral-100 ' +
                'dark:border-neutral-700 dark:hover:bg-neutral-800 ' +
                'disabled:bg-neutral-200 disabled:dark:bg-neutral-800 disabled:text-neutral-500 disabled:dark:text-neutral-400 ' +
                'shadow-blue-300 focus:border-blue-500 dark:shadow-blue-400 dark:focus:border-blue-400 ' +
                'px-5 py-2 min-w-[170px] text-center cursor-pointer'
              }
            >
              재학증명서 업로드
            </label>
            <input
              id={'file-upload'}
              type={'file'}
              className={'hidden'}
              disabled={working}
              onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)}
            />

            {(!checkFlag(formState, 4) || selectedFile) &&
              <p>{selectedFile ? `${selectedFile.name} (${prettyBytes(selectedFile.size)})` : '재학증명서를 제출해주세요.'}</p>}
            {(checkFlag(formState, 4) && !selectedFile) &&
              <Alert variant={'error'}>재학증명서를 제출해주세요.</Alert>}
          </Stack>
        </FormSection>
      </Stack>

      {checkFlag(formState, 5) &&
        <Alert variant={'error'}>reCAPTCHA를 완료하지 못했습니다. 다시 시도해주세요.</Alert>}
      {checkFlag(formState, 6) &&
        <Alert variant={'error'}>계정을 찾지 못했습니다.</Alert>}
      {checkFlag(formState, 7) &&
        <Alert variant={'error'}>이미 재학생 확인이 진행중입니다.</Alert>}
      {checkFlag(formState, 8) &&
        <Alert variant={'error'}>사용자 보호를 위해 지금은 요청을 처리할 수 없습니다.</Alert>}
      {checkFlag(formState, 9) &&
        <Alert variant={'error'}>재학생 확인을 신청하지 못했습니다.</Alert>}
      {checkFlag(formState, 10) &&
        <Alert variant={'error'}>재학증명서는 PDF, PNG, JPEG중 하나여야 합니다.</Alert>}
      {checkFlag(formState, 11) &&
        <Alert variant={'error'}>재학증명서 파일은 1 MB 이하여야 합니다.</Alert>}
      {checkFlag(formState, 12) &&
        <Alert variant={'error'}>재학증명서를 제출할 요청이 없습니다.</Alert>}
      {checkFlag(formState, 13) &&
        <Alert variant={'error'}>재학증명서를 제출하지 못했습니다.</Alert>}
      {checkFlag(formState, 14) &&
        <Alert variant={'success'}>신청을 제출했습니다.</Alert>}

      <Button className={'my-4'} onClick={validateForm}>재학생 확인 제출</Button>
    </div>
  );
}

export default CoreStudentVerification;
