import ModuleTemplate from "./ModuleTemplate.tsx";
import Stack from "../../layout/Stack.tsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {PageLoadingState} from "../../../modules/StandardPageFramework.ts";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import {SkeletonElement, SkeletonFrame} from "../../fragments/Skeleton.tsx";
import {Link} from "react-router-dom";
import {ExternalLinkIcon, Svg} from "../../../assets/svgs/svg.tsx";
import {numberLeftPad} from "../../../modules/content.ts";

interface SchoolInfo {
  "name": string;
  "schoolUUID": string;
  "neisCode": string;
  "grade": number;
  "classroom": number | null;
  "studentNumber": number | null;
  "homepage": string | null;
}

function StudentCard() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const userInfo = useAppSelector(state => state.userInfoReducer);
  const schoolInfo = useAppSelector(state => state.schoolReducer);

  const [school, setSchool] = useState<SchoolInfo>();
  const [loadState, setLoadState] = useState<PageLoadingState>(PageLoadingState.LOADING);

  useEffect(() => {
    axios.get(
      '/api/school',
      {headers: {Authorization: `Bearer ${jwt}`}}
    )
      .then((res) => {
        setSchool(res.data);
        setLoadState(PageLoadingState.SUCCESS);
      }).catch(() => {
        setLoadState(PageLoadingState.ERROR);
      });
  }, [jwt]);

  if (loadState === PageLoadingState.LOADING) {
    return (
      <ModuleTemplate name={''} className={'col-span-2'}>
        <SkeletonFrame>
          <Stack className={'items-end gap-3'}>
            <Stack className={'divide-y w-full'}>
              <Stack direction={'row'} className={'items-center gap-2 py-2 first:pt-0 last:pb-0'}>
                <SkeletonElement expH={24} expW={24}/>
                <SkeletonElement expH={24} expW={300}/>
              </Stack>
              <Stack direction={'row'} className={'items-center gap-2 py-2 first:pt-0 last:pb-0'}>
                <SkeletonElement expH={24} expW={24}/>
                <SkeletonElement expH={24} expW={300}/>
              </Stack>
              <Stack direction={'row'} className={'items-center gap-2 py-2 first:pt-0 last:pb-0'}>
                <SkeletonElement expH={24} expW={24}/>
                <SkeletonElement expH={24} expW={300}/>
              </Stack>
            </Stack>
            <SkeletonElement expH={20} expW={104.2}/>
          </Stack>
        </SkeletonFrame>
      </ModuleTemplate>
    )
  }
  else if (loadState === PageLoadingState.ERROR) {
    return (
      <ModuleTemplate name={''} className={'col-span-2'}>
        <p>재학 정보를 불러오지 못했습니다.</p>
      </ModuleTemplate>
    );
  }
  else if (loadState === PageLoadingState.SUCCESS) {
    return (
      <ModuleTemplate name={''}>
        <p className={'text-xl'}>{userInfo.username}님</p>

        {school?.homepage !== null &&
          <Stack direction={'row'} className={'items-center gap-1'}>
            <Link className={'my-2 text-lg'} to={school?.homepage ?? ''} target={'_blank'}>{schoolInfo.schoolName}</Link>
            <Svg
              src={ExternalLinkIcon}
              className={'w-[20px]'}
              css
              cssColor={'white'}
            />
          </Stack>
        }
        {school?.homepage === null &&
          <p className={'my-2 text-lg'}>{schoolInfo.schoolName}</p>
        }

        <div className={'grid grid-cols-2'}>
          <p>학번</p>
          <p>{school?.grade ?? '_'}{school?.classroom ?? '_'}{school?.studentNumber ? numberLeftPad(school.studentNumber, 2) : '__'}</p>
        </div>
      </ModuleTemplate>
    );
  }
}

export default StudentCard;
