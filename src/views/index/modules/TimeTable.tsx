import ModuleTemplate from "./ModuleTemplate.tsx";
import {useAppSelector} from "../../../modules/hook/ReduxHooks.ts";
import {ReactElement, useEffect, useState} from "react";
import axios from "axios";
import {PageLoadingState} from "../../../modules/StandardPageFramework.ts";
import Stack from "../../layout/Stack.tsx";

interface Schedule {
  subject: string,
  class: {
    grade: number,
    class: number
  },
  time: {
    date: number,
    period: number
  },
  classroom: string | null
}

function TimeTable() {
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);
  const [pageState, setPageState] = useState<PageLoadingState>(PageLoadingState.LOADING);

  const [ay, setAy] = useState<number>();
  const [sem, setSem] = useState<number>();
  const [tt, setTt] = useState<Schedule[]>();
  const [ttBegin, setTtBegin] = useState<Date>();
  const [ttEnds, setTtEnds] = useState<Date>();

  useEffect(() => {
    axios.get(
      '/api/school/neis/cached/timetable',
      { headers: { Authorization: `Bearer ${jwt}` } }
    ).then(res => {
      const schedules: [Schedule] = res.data['timetable']['schedules'];
      const ay: number = res.data['timetable']['academicYear'];
      const sem: number = res.data['timetable']['semester'];

      const begin = new Date(res.data['timetable']['period']['begin']);
      const end = new Date(res.data['timetable']['period']['end']);

      const sorted = schedules.sort((a, b) => {
        if(a.time.period === b.time.period) return a.time.date - b.time.date;
        else return a.time.period - b.time.period;
      });

      setAy(ay);
      setSem(sem);
      setTt(sorted);
      setTtBegin(begin);
      setTtEnds(end);

      setPageState(PageLoadingState.SUCCESS);
    }).catch(e => {
      setPageState(PageLoadingState.ERROR);
    })
  }, []);

  if((!tt || !ttBegin || !ttEnds) && pageState === PageLoadingState.LOADING) {
    return (
      <ModuleTemplate name={'시간표'} className={'col-span-2'}>
        <p>로딩중</p>
      </ModuleTemplate>
    );
  } else if((!tt || !ttBegin || !ttEnds) || pageState === PageLoadingState.ERROR) {
    return (
      <ModuleTemplate name={'시간표'} className={'col-span-2'}>
        <p>시간표를 불러오지 못했습니다.</p>
      </ModuleTemplate>
    );
  } else if(pageState === PageLoadingState.SUCCESS) {
    const table: ReactElement[] = [];
    let position = 0;

    for(let period = 1; position < tt.length; period++) {
      if(period > 99) {
        setPageState(PageLoadingState.ERROR);
        console.error('ESTOP - Period overflow');
        break;
      }
      const tr: ReactElement[] = [];

      for(let days = 0; days < 5; days++) {
        if(position >= tt.length) break;

        if(tt[position].time.date === days && tt[position].time.period === period) {
          tr.push(
            <td key={days}>
              <p>{tt[position].subject}</p>
            </td>
          );
          position += 1;
        }
        else if(tt[position].time.period === period && tt[position].time.date > days) {
          tr.push(
            <td key={days}></td>
          );
        } else if(tt[position].time.date < days) {
          position += 1;
          days -= 1;
          console.error('Malformed timetable(duplicated date) - SKIP SCHEDULE');
        }
      }

      table.push(<tr key={period}><th>{period}교시</th>{tr}</tr>);
    }

    return (
      <ModuleTemplate name={'시간표'} className={'col-span-2'}>
        <Stack direction={'row'} className={'justify-between mb-3 -mt-1'}>
          <p className={'px-2 text-lg font-bold'}>{ay}년 {sem}학기 | {tt[0].class.grade}학년 {tt[0].class.class}반</p>
          <p className={'px-2 text-lg font-bold'}>{ttBegin.getMonth()}.{ttBegin.getDate()} – {ttEnds.getMonth()}.{ttEnds.getDate()}</p>
        </Stack>
        <table className={'text-center divide-y w-full'}>
          <thead>
            <tr>
              <th>교시</th>
              <th>MON</th>
              <th>TUE</th>
              <th>WED</th>
              <th>THU</th>
              <th>FRI</th>
            </tr>
            {table}
          </thead>
        </table>
      </ModuleTemplate>
    );
  }
}

export default TimeTable;
