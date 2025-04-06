import {SchoolReduxState, SchoolStateType} from "../../modules/redux/SchoolReducer.ts";
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import NoSvIndex from "./NoSvIndex.tsx";
import SvIndex from "./SvIndex.tsx";
import ErrorSvIndex from "./ErrorSvIndex.tsx";

function Index() {
  const schoolState: SchoolStateType = useAppSelector(state => state.schoolReducer);

  if (schoolState.state === SchoolReduxState.NOT_VERIFIED) {
    return <NoSvIndex/>;
  }
  else if (schoolState.state === SchoolReduxState.VERIFIED) {
    return <SvIndex/>;
  }
  else if (schoolState.state === SchoolReduxState.ERROR) {
    return <ErrorSvIndex/>;
  }
}

export default Index;
