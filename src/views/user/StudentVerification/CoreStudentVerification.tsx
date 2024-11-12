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

function CoreStudentVerification() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className={'w-full px-5 sm:w-3/4 lg:w-1/2 pt-3 mx-auto'}>
      <Stack direction={'row'} className={'gap-4'}>
        <p className={'!text-5xl logo'}>BLINK</p>
        <p className={'text-2xl font-bold my-3'}>재학생 확인</p>
      </Stack>
      <Hr/>

      <Stack className={'gap-4 my-4'}>
        <p>재학생 확인 신청을 제출합니다. 기존에 제출한 재학생 확인의 진행상황은 <Link className={'text-blue-600 dark:text-blue-300 hover:underline'}
                                                         to={'/user/student-verification/check'}>이곳</Link>에서 확인할 수 있습니다.
        </p>
        <FormSection title={'재학생 확인 방법'}>
          <Stack direction={'row'}>
            <RadioButton
              id={'ver-method'}
              label={'재학증명서 제출'}
              checked={true}
            />
          </Stack>
          <p>재학증명서와 학적에 관한 정보를 제출하여 재학생 신분을 확인하는 방법입니다. 재학증명서는 <Link
            className={'text-blue-600 dark:text-blue-300 hover:underline'}
            to={'https://www.gov.kr/mw/AA020InfoCappView.do?HighCtgCD=A04007;A04001&CappBizCD=13410000017&tp_seq=01'}
            target={'_blank'}>정부 24</Link>에서 PDF로 방급받을 수 있습니다.</p>
        </FormSection>
        <FormSection title={'개인정보 입력'}>
          <p>이하의 개인정보는 재학증명서와 일치해야 합니다. 그렇지 않을 경우 재학생 확인이 거절될 수 있습니다.</p>
          <FormGroup label={'실명'}>
            <TextInput placeholder={'실명'} size={'sm'} label={'실명'}/>
          </FormGroup>
          <FormGroup label={'재학중인 학교 이름'}>
            <TextInput placeholder={'재학중인 학교'} size={'sm'} label={'재학중인 학교'}/>
          </FormGroup>
          <FormGroup label={'학년'}>
            <Select
              options={['1학년', '2학년', '3학년']}
              id={['1', '2', '3']}
              className={'max-w-[200px]'}
            />
          </FormGroup>
          <FormGroup label={'문서확인번호'}>
            <Stack direction={'row'}>
              <TextInput className={'w-1/5 text-center max-w-[80px]'} size={'sm'} type={'number'}/>
              <span className={'mx-2 my-1'}>&ndash;</span>
              <TextInput className={'w-1/5 text-center max-w-[80px]'} size={'sm'} type={'number'}/>
              <span className={'mx-2 my-1'}>&ndash;</span>
              <TextInput className={'w-1/5 text-center max-w-[80px]'} size={'sm'} type={'number'}/>
              <span className={'mx-2 my-1'}>&ndash;</span>
              <TextInput className={'w-1/5 text-center max-w-[80px]'} size={'sm'} type={'number'}/>
            </Stack>
            <p className={'mt-2 opacity-70'}>문서확인번호는 재학증명서 상단의 하이픈으로 구분된 16자리 숫자입니다.</p>
          </FormGroup>
        </FormSection>
        <FormSection title={'재학증명서 제출'}>
          <ol className={'list-disc pl-8 pr-4 py-3 border border-grey-400 dark:border-grey-600 rounded-lg'}>
            <li className={'my-1'}>재학증명서는 발급받은지 1개월 이내여야 합니다.</li>
            <li className={'my-1'}>재학증명서는 국문(한국어)로 발급받아야 합니다.</li>
            <li className={'my-1'}>재학증명서에 사진과 주민번호 뒷자리를 포함하지 말아야 합니다.</li>
            <li className={'my-1'}>출력된 재학증명서를 스캔/촬영하여 업로드하면 식별이 곤란하여 확인이 거절될 수 있습니다. 가급적 PDF로 다운받아 그대로 제출해주세요.</li>
          </ol>
          <label
            htmlFor={'file-upload'}
            className={
              'border my-2 py-2 px-4 w-fit rounded-lg cursor-pointer ' +
              'bg-transparent border-grey-300 text-grey-900 hover:bg-grey-200 hover:border-grey-300 hover:text-black ' +
              'dark:border-grey-800 dark:text-grey-100 dark:hover:bg-grey-800 dark:hover:border-grey-700 dark:hover:text-grey-200'
            }
          >
            재학증명서 업로드
          </label>
          <input
            id={'file-upload'}
            type={'file'}
            className={'hidden'}
            onChange={e => setSelectedFile(e.target.files ? e.target.files[0] : null)}
          />
          <p>{selectedFile ? `${selectedFile.name} (${prettyBytes(selectedFile.size)})` : '재학증명서를 제출해주세요.'}</p>
        </FormSection>
      </Stack>

      <Button className={'w-fit'}>재학생 확인 제출</Button>
    </div>
  );
}

export default CoreStudentVerification;
