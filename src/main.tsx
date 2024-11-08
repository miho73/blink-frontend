import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/root.scss'
import App from './views/App.tsx'
import {GoogleReCaptchaProvider} from "react-google-recaptcha-v3";
import {Provider} from "react-redux";
import store from "./modules/redux/RootReducer.ts";

const reCAPTCHAKey = import.meta.env.VITE_RECAPTCHA_SITEKEY;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GoogleReCaptchaProvider
      reCaptchaKey={reCAPTCHAKey}
      useEnterprise={true}
    >
      <App />
    </GoogleReCaptchaProvider>
    </Provider>
  </StrictMode>,
)
