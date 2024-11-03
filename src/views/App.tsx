import {BrowserRouter, Routes} from "react-router-dom";
import {Footer, Header} from "./fragments/UICover.tsx";

function App() {
  return (
    <BrowserRouter>
      <Header/>
      <main>
        <Routes>

        </Routes>
      </main>
      <Footer/>
    </BrowserRouter>
  )
}

export default App
