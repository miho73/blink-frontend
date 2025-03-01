import ModuleTemplate from "./ModuleTemplate.tsx";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import axios from "axios";
import {useEffect, useState} from "react";
import {Button} from "../../form/Button.tsx";
import Stack from "../../layout/Stack.tsx";
import Select from "../../form/Select.tsx";
import {Link} from "react-router-dom";

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
  const [pageState, setPageState] = useState(0);

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
  }, []);

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

  if (!doesTodayAServiceDay && pageState === 1) {
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
  } else if (selectedServiceTime in meal && showNutrients) {
    meal[selectedServiceTime].nutrients.map((value, index) => {
      mealInfo.push(<p key={index}>{value}</p>);
    });
    mealInfo.push(<p key={'cals'}>{meal[selectedServiceTime].calories} kcal</p>)
  } else {
    mealInfo.push(<p>급식 시간을 선택해주세요.</p>);
  }

  return (
    <ModuleTemplate name={'급식'}>
      {pageState === 0 && <p>급식 정보를 불러오는 중입니다.</p>}
      {pageState === 1 && (
        <Stack className={'gap-3 items-end'}>
          <div className={'grid grid-cols-[auto_81px] gap-x-2 w-full'}>
            <Select options={serviceTime} id={serviceTimeCode} onChange={setSelectedServiceTime}/>
            <Button size={'sm'} onClick={() => setShowNutrients(!showNutrients)} className={'w-[81px]'}>
              {showNutrients ? '식단' : '영양정보'}
            </Button>
          </div>
          <Stack className={'gap-1 w-full'}>{mealInfo}</Stack>
          <Link to={'/user/settings'} className={'text-sm'}>알러지 정보 설정 &gt;</Link>
        </Stack>
      )}
      {pageState === 2 && <p>급식 정보를 불러오지 못했습니다.</p>}
    </ModuleTemplate>
  );
}

export default MealNotice;
