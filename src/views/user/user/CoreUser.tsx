import DocumentFrame from "../../frames/DocumentFrame.tsx";
import {Hr} from "../../fragments/Hr.tsx";
import Stack from "../../layout/Stack.tsx";
import {ButtonLink} from "../../form/Button.tsx";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";

function CoreUser() {
  const userInfo = useAppSelector(state => state.userInfoReducer)

  return (
    <DocumentFrame>
      <Stack direction={'row'} className={'justify-between items-center'}>
        <p className={'text-3xl font-light'}>{userInfo.username}</p>
        <ButtonLink to={'/user/settings/general'}>프로필 수정</ButtonLink>
      </Stack>
      <Hr/>
      <Stack>
        <p>// TODO: Fill with user uploaded posts</p>
      </Stack>
    </DocumentFrame>
  )
}

export default CoreUser;
