import {Route, Routes, useParams} from "react-router-dom";
import Board from "./Board.tsx";
import Write from "./Write.tsx";
import NotFound from "../error/NotFound.tsx";

function CoreBoard() {
  const params = useParams();
  const boardName = params.boardName;

  if (!boardName) {
    //TODO: Show something special
    return (
      <div>
        <h1>Board Not Found</h1>
      </div>
    );
  }

  return (
    <Routes>
      <Route path={''} element={<Board boardName={boardName}/>}/>
      <Route path={'/write'} element={<Write boardName={boardName}/>}/>
      <Route path={'*'} element={<NotFound/>}/>
    </Routes>
  );
}

export default CoreBoard;
