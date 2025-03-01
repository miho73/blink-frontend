import DocumentFrame from "../frames/DocumentFrame.tsx";
import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axios from "axios";
import {PageLoadingState} from "../../modules/StandardPageFramework.ts";
import {marked} from "marked";
import DOMPurify from "dompurify";

const docsList = [
  'eula', 'privacy'
]

function CoreDocs() {
  // url에서 문서 id 받기
  const params = useParams();
  const documentIdentifier = params.docId;

  const [documentMarkdown, setDocumentMarkdown] = useState<string>('');
  const [pageState, setPageState] = useState<PageLoadingState>(PageLoadingState.LOADING);

  useEffect(() => {
    if(!documentIdentifier || !docsList.includes(documentIdentifier)) {
      setPageState(PageLoadingState.ERROR);
      return;
    }

    axios.get(`/open-docs/${documentIdentifier}.md`)
      .then(res => {
        setDocumentMarkdown(res.data);
        setPageState(PageLoadingState.SUCCESS);
      }).catch(() => {
        setPageState(PageLoadingState.ERROR);
      });
  }, [documentIdentifier]);

  if(pageState === PageLoadingState.LOADING) {
    return (
      <DocumentFrame>
        <p>문서 로딩중</p>
      </DocumentFrame>
    );
  } else if(pageState === PageLoadingState.ERROR) {
    return (
      <DocumentFrame>
        <p>문서를 불러오지 못했습니다.</p>
      </DocumentFrame>
    );
  } else if(pageState === PageLoadingState.SUCCESS) {
    const elements = marked.parse(documentMarkdown) as string;
    const pureElement = DOMPurify.sanitize(elements);

    return (
      <DocumentFrame>
        <div className={'markdown'} dangerouslySetInnerHTML={{__html: pureElement}}/>
      </DocumentFrame>
    );
  }
}

export default CoreDocs;
