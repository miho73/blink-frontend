import {SchoolReduxState, SchoolStateType} from "../../modules/redux/SchoolReducer.ts";
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import NoSvIndex from "./NoSvIndex.tsx";
import SvIndex from "./SvIndex.tsx";

function Index() {
  const schoolState: SchoolStateType = useAppSelector(state => state.schoolReducer);

  if(schoolState.state === SchoolReduxState.NOT_VERIFIED) {
    return <NoSvIndex/>;
  }
  if(schoolState.state === SchoolReduxState.VERIFIED) {
    return <SvIndex/>;
  }
}

export default Index;
