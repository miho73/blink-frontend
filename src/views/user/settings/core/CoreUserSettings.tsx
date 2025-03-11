import Stack from "../../../layout/Stack.tsx";
import AuthSettings from "../AuthSettings/AuthSettings.tsx";
import GeneralSettings from "../GeneralSettings/GeneralSettings.tsx";
import {KeyIcon, PencilIcon, PersonalIcon, ProfileIcon, Svg} from "../../../../assets/svgs/svg.tsx";
import {Hr} from "../../../fragments/Hr.tsx";
import StudentCheckSettings from "../StudentVerificationSettings/StudentCheckSettings.tsx";
import SettingsTabButton from "./SettingsTabButton.tsx";
import SettingsToolButtons from "./SettingsToolButtons.tsx";
import PreferenceSettings from "../PreferenceSettings/UserPreference.tsx";
import {useParams} from "react-router-dom";
import {ReactElement} from "react";

function CoreUserSettings() {
  const params = useParams();
  const selectedTab = params.id;
  let tabContent: ReactElement;

  switch (selectedTab) {
    case 'general':
      tabContent = <GeneralSettings/>;
      break;
    case 'auth':
      tabContent = <AuthSettings/>;
      break;
    case 'sv':
      tabContent = <StudentCheckSettings/>;
      break;
    case 'preference':
      tabContent = <PreferenceSettings/>;
      break;
    default:
      tabContent = <GeneralSettings/>;
  }

  return (
    <div className={'w-full lg:w-3/4 px-5 mx-auto grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[250px_1fr]'}>
      <Stack className={'mb-4'}>
        <SettingsTabButton
          selected={selectedTab === 'general'}
          path={'general'}
          icon={<Svg src={ProfileIcon} className={'w-[20px]'} css cssColor={'gray'}/>}
        >
          프로필
        </SettingsTabButton>

        <SettingsTabButton
          selected={selectedTab === 'auth'}
          path={'auth'}
          icon={<Svg src={KeyIcon} className={'w-[24px]'} css cssColor={'gray'}/>}
        >
          인증 및 보안
        </SettingsTabButton>

        <SettingsTabButton
          selected={selectedTab === 'sv'}
          path={'sv'}
          icon={<Svg src={PencilIcon} className={'w-[24px]'} css cssColor={'gray'}/>}
        >
          재학생 확인
        </SettingsTabButton>

        <SettingsTabButton
          selected={selectedTab === 'preference'}
          path={'preference'}
          icon={<Svg src={PersonalIcon} className={'w-[24px]'} css cssColor={'gray'}/>}
        >
          개인 설정
        </SettingsTabButton>

        <Hr/>
        <SettingsToolButtons/>
      </Stack>
      <div className={'md:mt-3 md:ml-16 max-w-[600px]'}>{tabContent}</div>
    </div>
  )
}

export default CoreUserSettings;
