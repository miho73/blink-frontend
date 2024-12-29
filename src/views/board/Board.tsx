import DocumentFrame from "../frames/DocumentFrame.tsx";
import Stack from "../layout/Stack.tsx";
import {ButtonLink} from "../form/Button.tsx";
import {Hr} from "../fragments/Hr.tsx";

function Board({boardName}: { boardName: string }) {
  return (
    <DocumentFrame>
      <Stack direction={'row'} className={'justify-between'}>
        <Stack direction={'row'} className={'items-center'}>
          <p className={'text-xl font-medium'}>{boardName}</p>
        </Stack>
        <Stack>
          <ButtonLink to={'write'}>글쓰기</ButtonLink>
        </Stack>
      </Stack>
      <Hr/>
      <div className={'grid grid-cols-2'}>
        <p>ddd</p>
        <p>ddd</p>
        <p>ddd</p>
        <p>ddd</p>
        <p>ddd</p>
        <p>ddd</p>
        <p>ddd</p>
        <p>ddd</p>
        <p>ddd</p>
      </div>
      <Stack direction={'row'}></Stack>
    </DocumentFrame>
  );
}

export default Board;
