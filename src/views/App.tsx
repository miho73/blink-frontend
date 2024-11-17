import {BrowserRouter, Route, Routes} from "react-router-dom";
import {Footer, Header} from "./fragments/UiCover.tsx";
import NotFound from "./error/NotFound.tsx";
import AuthenticationRouteFrame from "./Frames/RouteFrames/AuthenticationRouteFrame.tsx";
import UserAuthenticatedRouteFrame from "./Frames/RouteFrames/UserAuthenticatedRouteFrame.tsx";
import UserUnauthenticatedRouteFrame from "./Frames/RouteFrames/UserUnauthenticatedRouteFrame.tsx";
import AuthenticationFrame from "./Frames/AuthenticationFrame.tsx";

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <main className={'mb-10 mt-3'}>
        <Routes>

          <Route path={'/'} element={<AuthenticationFrame>
            <div>Hello, World!</div>
          </AuthenticationFrame>}/>

          <Route path={'/auth/*'} element={<AuthenticationRouteFrame/>}/>
          <Route path={'/user/n/*'} element={<UserUnauthenticatedRouteFrame/>}/>
          <Route path={'/user/*'} element={<UserAuthenticatedRouteFrame/>}/>

          <Route path={'*'} element={<NotFound/>}/>
        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
