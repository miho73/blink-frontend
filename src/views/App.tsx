import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Footer, Header} from "./fragments/UICover.tsx";
import NotFound from "./error/NotFound.tsx";
import AuthenticatedFrame from "./Frames/AuthenticatedFrame.tsx";
import AuthenticationFrame from "./Frames/AuthenticationFrame.tsx";

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <main>
        <Routes>
          <Route path={'/auth/*'} element={<AuthenticationFrame/>}/>

          <Route element={<AuthenticatedFrame/>}>

          </Route>

          <Route path={'*'} element={<NotFound/>}/>
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
