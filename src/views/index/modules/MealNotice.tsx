import ModuleTemplate from "./ModuleTemplate.tsx";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import axios from "axios";
import {useEffect, useState} from "react";
import {Button} from "../../form/Button.tsx";
import Stack from "../../layout/Stack.tsx";
import Select from "../../form/Select.tsx";
import {Link} from "react-router-dom";
import {FlameIcon, Svg} from "../../../assets/svgs/svg.tsx";
import {PageLoadingState} from "../../../modules/StandardPageFramework.ts";
import {SkeletonElement, SkeletonFrame} from "../../fragments/Skeleton.tsx";

const ALLERGY_CODE = [
  '난류',
  '우유',
  '메밀',
  '땅콩',
  '대두, 콩',
  '밀',
  '고등어',
  '게',
  '새우',
  '돼지고기',
  '복숭아',
  '토마토',
  '아황산류',
  '호두',
  '닭고기',
  '쇠고기',
  '오징어',
  '조개류'
]

interface MealInfo {
  diet: [string],
  nutrients: [string],
  calories: string
}

function AllergyBadge(props: { allergyCode: number }) {
  if (props.allergyCode in ALLERGY_CODE) {
    return (
      <span className={'px-2 py-1 bg-red-500 text-white rounded-sm min-w-fit cursor-default'}>
      {ALLERGY_CODE[props.allergyCode - 1]}
    </span>
    );
  } else return null;
}

function MealNotice() {
  const neis_code = useAppSelector(state => state.schoolReducer.schoolNeisCode);
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const [allergyPref, setAllergyPref] = useState<number>(0);
  const [meal, setMeal] = useState<{ [key: string]: MealInfo }>({});
  const [doesTodayAServiceDay, setDoesTodayAServiceDay] = useState(false);
  const [showNutrients, setShowNutrients] = useState<boolean>(false);
  const [selectedServiceTime, setSelectedServiceTime] = useState<string>('0');

  const [pageState, setPageState] = useState<PageLoadingState>(PageLoadingState.LOADING);

  useEffect(() => {
    axios.get(
      '/api/school/neis/cached/meal',
      {
        params: {'neis-code': neis_code},
        headers: {'Authorization': 'Bearer ' + jwt}
      }
    ).then(res => {
      setMeal(res.data['meal']);
      setAllergyPref(res.data['allergy']);
      setPageState(1);

      if (Object.keys(res.data['meal']).length === 0) setDoesTodayAServiceDay(false);
      else setDoesTodayAServiceDay(true);

      // 20:00 - 9:00 : 조식
      // 9:00 - 14:00 : 중식
      // 14:00 - 20:00 : 석식
      const time = new Date().getHours();
      if (time >= 20 || time < 9) setSelectedServiceTime('1');
      else if (time >= 9 && time < 14) setSelectedServiceTime('2');
      else if (time >= 14 && time < 20) setSelectedServiceTime('3');
    }).catch(() => {
      setPageState(2);
    });
  }, [jwt]);

  if(pageState === PageLoadingState.LOADING) {
    return (
      <ModuleTemplate name={'급식'}>
        <SkeletonFrame>
          <Stack className={'gap-3 items-end'}>
            <div className={'grid grid-cols-[auto_81px] gap-x-2 w-full'}>
              <SkeletonElement expH={42} expW={176.34}/>
              <SkeletonElement expH={42} expW={81}/>
            </div>
            <Stack className={'gap-1 w-full'}>
              <SkeletonElement className={'my-1'} expW={'70%'} expH={24}/>
              <SkeletonElement className={'my-1'} expW={'75%'} expH={24}/>
              <SkeletonElement className={'my-1'} expW={'45%'} expH={24}/>
              <SkeletonElement className={'my-1'} expW={'57%'} expH={24}/>
              <SkeletonElement className={'my-1'} expW={'39%'} expH={24}/>
              <SkeletonElement className={'my-1'} expW={'69%'} expH={24}/>
            </Stack>
            <SkeletonElement expH={20} expW={107.33}/>
          </Stack>
        </SkeletonFrame>
      </ModuleTemplate>
    );
  }
  else if(pageState === PageLoadingState.ERROR) {
    return (
      <ModuleTemplate name={'급식'}>
        <p>급식 정보를 불러오지 못했습니다.</p>
      </ModuleTemplate>
    )
  }

  const serviceTime = [];
  const serviceTimeCode = [];
  if (1 in meal) {
    serviceTime.push('조식');
    serviceTimeCode.push('1');
  }
  if (2 in meal) {
    serviceTime.push('중식');
    serviceTimeCode.push('2');
  }
  if (3 in meal) {
    serviceTime.push('석식');
    serviceTimeCode.push('3');
  }

  if (!doesTodayAServiceDay && pageState === PageLoadingState.SUCCESS) {
    return (
      <ModuleTemplate name={'급식'}>
        <Stack className={'gap-3 items-end'}>
          <p className={'text-left w-full'}>오늘은 급식 정보가 없습니다.</p>
          <Link to={'/user/settings'} className={'text-sm'}>알러지 정보 설정 &gt;</Link>
        </Stack>
      </ModuleTemplate>
    );
  }

  const mealInfo = [];
  if (selectedServiceTime in meal && !showNutrients) {
    meal[selectedServiceTime].diet.map((value, index) => {
      const match = value.split(' ');

      const mealStr = match[0];
      const allergyStr = (
        (match[1] === undefined) ? [] : match[1]
          .slice(1, -1)
          .split('.')
          .map((allergyCode) => {
            const allergyInt: number = parseInt(allergyCode);

            if (allergyPref & (1 << allergyInt)) {
              return (
                <AllergyBadge allergyCode={allergyInt}/>
              );
            }
          })
      );

      mealInfo.push(
        <Stack direction={'row'} className={'items-center gap-3'}>
          <p key={index} className={'min-w-fit py-1'}>{mealStr}</p>
          <Stack direction={'row'} className={'gap-x-2 overflow-x-auto'}>{allergyStr}</Stack>
        </Stack>
      );
    });
  }
  else if (selectedServiceTime in meal && showNutrients) {
    const nutrients = meal[selectedServiceTime].nutrients;

    const carbohydrate = nutrients[0].startsWith('탄수화물(g)') ? parseInt(nutrients[0].split(' ')[2]) : 0;
    const protein = nutrients[1].startsWith('단백질(g)') ? parseInt(nutrients[1].split(' ')[2]) : 0;
    const fat = nutrients[2].startsWith('지방(g)') ? parseInt(nutrients[2].split(' ')[2]) : 0;
    const logCarbohydrate = Math.log(carbohydrate);
    const logProtein = Math.log(protein);
    const logFat = Math.log(fat);

    const total = logCarbohydrate + logProtein + logFat + 17;

    mealInfo.push(
      <Stack className={'gap-4'}>
        <Stack direction={'row'} className={'w-full h-[40px]'}>
          <div
            className={
              'h-full bg-[#4FAFA9] ' +
              'flex justify-center items-center ' +
              'transition-all'
            }
            title={'탄수화물'}
            style={{width: `${100 * (4+logCarbohydrate) / total}%`}}
          >
            <p className={'text-[#1E4937] md:text-lg select-none'}>{carbohydrate} g</p>
          </div>
          <div
            className={
              'h-full bg-[#4974BE] ' +
              'flex justify-center items-center ' +
              'transition-all'
            }
            title={'단백질'}
            style={{width: `${100 * (4+logProtein) / total}%`}}
          >
            <p className={'text-[#102F47] md:text-lg select-none'}>{protein} g</p>
          </div>
          <div
            className={
              'h-full bg-[#EFA73E] ' +
              'flex justify-center items-center ' +
              'transition-all'
            }
            title={'지방'}
            style={{width: `${100 * (9+logFat) / total}%`}}
          >
            <p className={'text-[#7A3A1C] md:text-lg select-none'}>{fat} g</p>
          </div>
        </Stack>
        <Stack direction={'row'} className={'gap-5 justify-center items-center'}>
          <Stack direction={'row'} className={'gap-2'}>
            <Svg
              src={FlameIcon}
              css cssColor={'white'}
              className={'w-[27px]'}
            />
            <p className={'text-center text-3xl'}>{meal[selectedServiceTime]['calories']} kcal</p>
          </Stack>
        </Stack>
      </Stack>
    )
  }
  else {
    mealInfo.push(<p>급식 시간을 선택해주세요.</p>);
  }

  return (
    <ModuleTemplate name={'급식'}>
      <Stack className={'gap-3 items-end'}>
        <div className={'grid grid-cols-[auto_81px] gap-x-2 w-full'}>
          <Select
            options={serviceTime}
            id={serviceTimeCode}
            onChange={setSelectedServiceTime}
            value={selectedServiceTime}
          />
          <Button size={'sm'} onClick={() => setShowNutrients(!showNutrients)} className={'w-[81px]'}>
            {showNutrients ? '식단' : '영양정보'}
          </Button>
        </div>
        <Stack className={'gap-1 w-full'}>{mealInfo}</Stack>
        <Link to={'/user/settings/preference'} className={'text-sm'}>알러지 정보 설정 &gt;</Link>
      </Stack>
    </ModuleTemplate>
  );
}

export default MealNotice;
