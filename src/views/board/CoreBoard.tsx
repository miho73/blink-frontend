import {Route, Routes, useParams} from "react-router-dom";
import Board from "./Board.tsx";
import Write from "./Write.tsx";
import AuthenticationFrame from "../frames/AuthenticationFrame.tsx";
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {useEffect} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {actions} from "../../modules/redux/BoardReducer.ts";
import Post from "./Post.tsx";
import NotFound from "../error/NotFound.tsx";
import Stack from "../layout/Stack.tsx";
import {Hr} from "../fragments/Hr.tsx";
import DocumentFrame from "../frames/DocumentFrame.tsx";
import {SkeletonElement, SkeletonFrame} from "../fragments/Skeleton.tsx";
import ErrorPage from "../error/ErrorPage.tsx";
import EditPost from "./EditPost.tsx";

function CoreBoard() {
  // Route 경로에서 boardIdentifier 얻기
  const params = useParams();
  const boardIdentifier = params.boardId;

  // redux에서 로그인 된 JWT 얻기
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  // redux에서 board 작업에 필요한 값, 함수 얻기
  const reduxBoardId = useAppSelector(state => state.boardReducer.boardId);
  const reduxBoardName = useAppSelector(state => state.boardReducer.boardName);
  const reduxBoardState = useAppSelector(state => state.boardReducer.state);
  const dispatch = useDispatch();

  // boardIdentifier로 redux 초기화 시도
  useEffect(() => {
    // jwt가 없을 시, 로그인 안 되어 있으니 로딩 중단. AuthenticationFrame에서 핸들링
    if (!jwt) {
      return;
    }
    // boardIdentifier가 명시되지 않았을 시 리젝(2, boardId Not Specified)
    if (!boardIdentifier) {
      dispatch(actions.reject(2));
      return;
    }

    // boardIdentifier가 UUID인 경우 board name으로 resolve 시도
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(boardIdentifier)) {
      // redux에 캐시된 board 정보와 boardName이 일치하면 cache hit
      if (boardIdentifier === reduxBoardName) {
        return;
      }

      // cache miss시 로딩 플래그 세우고 api 호출
      dispatch(
        actions.setState(1)
      );

      axios.get(
        '/api/social/board',
        {
          params: {name: boardIdentifier},
          headers: {Authorization: `Bearer ${jwt}`}
        }
      ).then(res => {
        // resolve 완료
        dispatch(
          actions.enterBoard({
            boardId: res.data.board.id,
            boardName: res.data.board.name,
            state: 0
          })
        );
      }).catch(err => {
        if(err.response.status === 403) {
          // 403 Forbidden 에러시, 권한 없음으로 리젝(4)
          dispatch(actions.reject(4));
        }

        // board name으로 resolve하지 못한 경우 리젝(3, board cannot be loaded)
        else dispatch(actions.reject(3));
      });
    }
    // boardIdentifier가 UUID 형태인 경우 boardId로 board 정보 얻기
    else {
      // redux에 캐시된 board 정보와 boardId가 일치하면 cache hit
      if (reduxBoardId === boardIdentifier) {
        return;
      }

      // cache miss시 로딩 플래그 세우고 api 호출
      dispatch(
        actions.setState(1)
      );
      axios.get(
        `/api/social/board/${boardIdentifier}`,
        {headers: {Authorization: `Bearer ${jwt}`}}
      ).then(res => {
        // resolve 완료
        dispatch(
          actions.enterBoard({
            boardId: res.data.board.id,
            boardName: res.data.board.name,
            state: 0
          })
        );
      }).catch(err => {
        if(err.response.status === 403) {
          // 403 Forbidden 에러시, 권한 없음으로 리젝(4)
          dispatch(actions.reject(4));
        }

        // boardId로 resolve하지 못한 경우 리젝(3, board cannot be loaded)
        else dispatch(actions.reject(3));
      });
    }
  }, [jwt, boardIdentifier]);

  // state = 0: OK, 1: not set, 2: identifier not specified, 3: board cannot be loaded, 4: permission denied

  if (reduxBoardState === 0) {
    return (
      <AuthenticationFrame>
        <Routes>
          <Route path={''} element={<Board/>}/>
          <Route path={'/write'} element={<Write/>}/>
          <Route path={'/post/:postId'} element={<Post/>}/>
          <Route path={'/edit/:postId'} element={<EditPost/>}/>
          <Route path={'*'} element={<NotFound/>}/>
        </Routes>
      </AuthenticationFrame>
    );
  } else if (reduxBoardState === 1) {
    return (
      <AuthenticationFrame>
        <SkeletonFrame>
          <DocumentFrame>
            <Stack direction={'row'} className={'justify-between'}>
              <SkeletonElement expW={250} expH={40}/>
              <SkeletonElement expW={76} expH={40}/>
            </Stack>
            <Hr/>
            <Stack className={'gap-3'}>
              <SkeletonElement className={'w-[60%]'} expH={20}/>
              <SkeletonElement className={'w-[40%]'} expH={20}/>
              <SkeletonElement className={'w-[70%]'} expH={20}/>
              <SkeletonElement className={'w-[50%]'} expH={20}/>
              <SkeletonElement className={'w-[66%]'} expH={20}/>
            </Stack>
          </DocumentFrame>
        </SkeletonFrame>
      </AuthenticationFrame>
    );
  } else if (reduxBoardState === 2) {
    return (
      <AuthenticationFrame>
        <NotFound/>
      </AuthenticationFrame>
    );
  } else if (reduxBoardState === 3) {
    return (
      <AuthenticationFrame>
        <ErrorPage errorTitle={'게시판을 볼 수 없습니다.'} errorMessage={'게시판을 불러오지 못했습니다.'}/>
      </AuthenticationFrame>
    );
  } else if (reduxBoardState === 4) {
    return (
      <AuthenticationFrame>
        <ErrorPage errorTitle={'게시판을 볼 수 없습니다.'} errorMessage={'게시판을 볼 권한이 있는지 확인해주세요.'}/>
      </AuthenticationFrame>
    );
  } else {
    return (
      <AuthenticationFrame>
        <NotFound/>
      </AuthenticationFrame>
    );
  }
}

export default CoreBoard;
