import Stack from "../../layout/Stack.tsx";
import {ReactElement, ReactNode, useState} from "react";
import AuthSettings from "./AuthSettings.tsx";
import GeneralSettings from "./GeneralSettings.tsx";
import {PencilIcon, ProfileIcon, Svg} from "../../../assets/svgs/svg.tsx";
import {Hr} from "../../fragments/Hr.tsx";
import StudentCheckSettings from "./StudentCheckSettings.tsx";

function CoreUserSettings() {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  let tabContent: ReactNode;

  switch (selectedTab) {
    case 0:
      tabContent = <GeneralSettings/>
      break;
    case 1:
      tabContent = <AuthSettings/>
      break;
    case 2:
      tabContent = <StudentCheckSettings/>
      break;
    default:
      tabContent = <GeneralSettings/>
  }

  return (
    <div className={'w-full lg:w-3/4 px-5 mx-auto grid grid-rows-[auto_1fr] md:grid-rows-1 md:grid-cols-[250px_1fr]'}>
      <Stack>
        <SettingsTabButton
          selected={selectedTab === 0}
          setter={() => setSelectedTab(0)}
          icon={<Svg src={ProfileIcon} css cssColor={'gray'}/>}
        >
          프로필
        </SettingsTabButton>

        <SettingsTabButton
          selected={selectedTab === 1}
          setter={() => setSelectedTab(1)}
          icon={<Svg src={ProfileIcon} css cssColor={'gray'}/>}
        >
          인증 및 보안
        </SettingsTabButton>

        <SettingsTabButton
          selected={selectedTab === 2}
          setter={() => setSelectedTab(2)}
          icon={<Svg src={PencilIcon} css cssColor={'gray'}/>}
        >
          재학생 확인
        </SettingsTabButton>
        <Hr/>
      </Stack>
      <div className={'md:mt-3 md:ml-16 max-w-[600px]'}>{tabContent}</div>
    </div>
  )
}

interface SettingsTabProps {
  children: ReactNode;
  setter: () => void;
  icon: ReactElement;
  selected: boolean
}

function SettingsTabButton(props: SettingsTabProps) {
  return (
    <button
      onClick={props.setter}
      className={
        'my-1 py-2 pl-[20px] text-left font-medium flex justify-start items-center gap-3' +
        (props.selected ? ' border-l-4 border-blue-600 dark:border-blue-500 !pl-[16px]' : '')
      }
    >
      {props.icon}
      {props.children}
    </button>
  )
}

export default CoreUserSettings;
