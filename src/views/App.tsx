import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Footer, Header} from "./fragments/UICover.tsx";
import NotFound from "./error/NotFound.tsx";
import AuthenticatedFrame from "./Frames/AuthenticatedFrame.tsx";
import AuthenticationFrame from "./Frames/AuthenticationFrame.tsx";
import CoreStudentVerification from "./user/StudentVerification/CoreStudentVerification.tsx";
import CheckVerificationStatus from "./user/StudentVerification/CheckVerificationStatus.tsx";

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <main className={'mb-10 mt-3'}>
        <Routes>
          <Route path={'/auth/*'} element={<AuthenticationFrame/>}/>

          <Route element={<AuthenticatedFrame/>}>
            <Route path={'/'} element={<div>Home</div>}/>
            <Route path={'/user/student-verification'} element={<CoreStudentVerification/>}/>
            <Route path={'/user/student-verification/check'} element={<CheckVerificationStatus/>}/>
            <Route path={'*'} element={<NotFound/>}/>
          </Route>

          <Route path={'*'} element={<NotFound/>}/>
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
