import {FormGroup, FormSection} from "../../form/Form.tsx";
import {TextInput} from "../../form/TextInput.tsx";
import {Button} from "../../form/Button.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import Alert from "../../form/Alert.tsx";
import {CancelIconDark, CancelIconLight, CheckIconDark, CheckIconLight, Svg} from "../../../assets/svgs/svg.tsx";
import ThemeSelector from "../../../css/ThemeSelector.tsx";

function GeneralSettings() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);
  const [pageState, setPageState] = useState<number>(0);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [emailVerified, setEmailVerified] = useState<boolean>(false);

  let emailSidecar = <ThemeSelector light={<Svg src={CancelIconLight}/>} dark={<Svg src={CancelIconDark}/>} className={'w-[20px]'}/>;
  if(emailVerified) {
    emailSidecar = <ThemeSelector light={<Svg src={CheckIconLight}/>} dark={<Svg src={CheckIconDark}/>} className={'w-[20px]'}/>;
  }

  // TODO: 로딩중 애니메이션 다듬기
  useEffect(() => {
    axios.get(
      '/api/user/get',
      {headers: {'Authorization': `Bearer ${jwt}`}}
    ).then(res => {
      setUsername(res.data.user.username);
      setEmail(res.data.user.email);
      setEmailVerified(res.data.user.emailVerified);
      setPageState(2);
    }).catch(() => {
      setPageState(1);
    });
  }, [jwt]);

  // TODO: 캡션 다듬기
  if(pageState === 1) {
    return (
      <FormSection title={'프로필'}>
        <Alert variant={'error'}>프로필을 로딩하지 못했습니다.</Alert>
      </FormSection>
    )
  }
  else if(pageState === 2 || pageState === 0) {
    return (
      <FormSection title={'프로필'}>
        <FormGroup label={'이름'} strong>
          <TextInput
            placeholder={'이름'}
            label={'이메일'}
            value={username}
            setter={setUsername}
            size={'sm'}
            authComplete={'username'}
          />
          <label className={'my-2 text-grey-600 dark:text-grey-400'}>이 이름은 BLINK 내에서 사용되는 이름입니다.</label>
        </FormGroup>
        <FormGroup
          label={'이메일'}
          strong
          sidecar={emailSidecar}
        >
          <TextInput
            placeholder={'이메일'}
            label={'이메일'}
            value={email}
            setter={setEmail}
            size={'sm'}
            authComplete={'email'}
          />
          <label className={'my-2 text-grey-600 dark:text-grey-400'}>이메일은 BLINK 내에서 사용되는 식별자입니다.</label>
        </FormGroup>
        <Button size={'custom'} className={'w-fit px-5 py-3'}>프로필 업데이트</Button>
      </FormSection>
    );
  }
}

export default GeneralSettings;
