import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Footer, Header} from "./fragments/UiCover.tsx";
import NotFound from "./error/NotFound.tsx";
import AuthenticationRouteFrame from "./frames/RouteFrames/AuthenticationRouteFrame.tsx";
import UserAuthenticatedRouteFrame from "./frames/RouteFrames/UserAuthenticatedRouteFrame.tsx";
import UserUnauthenticatedRouteFrame from "./frames/RouteFrames/UserUnauthenticatedRouteFrame.tsx";
import AuthenticationFrame from "./frames/AuthenticationFrame.tsx";
import CoreRoot from "./root/CoreRoot.tsx";

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <main className={'my-3'}>
        <Routes>
          <Route path={'/'} element={
            <AuthenticationFrame>
              <div>Hello, World!</div>
            </AuthenticationFrame>
          }/>

          <Route path={'/auth/*'} element={<AuthenticationRouteFrame/>}/>
          <Route path={'/user/n/*'} element={<UserUnauthenticatedRouteFrame/>}/>
          <Route path={'/user/*'} element={<UserAuthenticatedRouteFrame/>}/>

          <Route path={'/root/*'} element={<CoreRoot/>}/>

          <Route path={'*'} element={<NotFound/>}/>
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
