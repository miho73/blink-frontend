import {Route, Routes, useParams} from "react-router-dom";
import Board from "./Board.tsx";
import Write from "./Write.tsx";
import NotFound from "../error/NotFound.tsx";
import AuthenticationFrame from "../frames/AuthenticationFrame.tsx";
import {useAppSelector} from "../../modules/hook/ReduxHooks.ts";
import {useEffect} from "react";
import axios from "axios";
import {useDispatch} from "react-redux";
import {actions} from "../../modules/redux/BoardReducer.ts";

function CoreBoard() {
  const params = useParams();
  const boardId = params.boardId;
  const jwt = useAppSelector(state => state.userInfoReducer.jwt);

  const reduxBoardId = useAppSelector(state => state.boardReducer.boardId);
  const dispatch = useDispatch();

  useEffect(() => {
    if(!jwt) {
      return;
    }
    if(!boardId) {
      dispatch(actions.reject(1));
      return;
    }
    if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(boardId)) {
      dispatch(actions.reject(1));
      return;
    }
    if(reduxBoardId === boardId) {
      return;
    }

    axios.get(
      `/api/social/board/${boardId}`,
      {headers: {Authorization: `Bearer ${jwt}`}}
    ).then(res => {
      dispatch(
        actions.enterBoard({
          boardId: res.data.board.id,
          boardName: res.data.board.name,
          state: 0
        })
      );
    }).catch(() => {
      dispatch(actions.reject(2));
    });
  }, [jwt, boardId]);

  return (
    <AuthenticationFrame>
      <Routes>
        <Route path={''} element={<Board/>}/>
        <Route path={'/write'} element={<Write/>}/>
        <Route path={'*'} element={<NotFound/>}/>
      </Routes>
    </AuthenticationFrame>
  );
}

export default CoreBoard;
