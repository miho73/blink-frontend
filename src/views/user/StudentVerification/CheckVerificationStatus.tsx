import Stack from "../../layout/Stack.tsx";
import {Hr} from "../../fragments/Hr.tsx";
import {Button} from "../../form/Button.tsx";

function CheckVerificationStatus() {

  return (
    <div className={'w-full px-5 sm:w-3/4 lg:w-1/2 pt-3 mx-auto'}>
      <Stack direction={'row'} className={'gap-4'}>
        <p className={'!text-5xl logo'}>BLINK</p>
        <p className={'text-2xl font-bold my-3'}>재학생 확인 조회</p>
      </Stack>
      <Hr/>

      <div className={'table-root'}>
        <table>
          <thead>
          <tr>
            <th>신청 번호</th>
            <th>상태</th>
            <th>신청 시각</th>
            <th>신청 정보</th>
          </tr>
          </thead>
          <tbody>
          <tr className={'text-center'}>
            <td>2332-3992</td>
            <td className={'text-green-700 dark:text-green-300 font-bold'}>승인됨</td>
            <td>2024.11.12 12:30:32 KST</td>
            <td>
              <Button size={'sm'}>확인</Button>
            </td>
          </tr>
          <tr className={'text-center'}>
            <td>2332-3992</td>
            <td className={'text-red-600 dark:text-red-300 font-bold'}>거절됨 (서류 불일치)</td>
            <td>2024.11.12 12:30:32 KST</td>
            <td>
              <Button size={'sm'}>확인</Button>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CheckVerificationStatus;
