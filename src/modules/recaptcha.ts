import {IGoogleReCaptchaConsumerProps} from "react-google-recaptcha-v3";

async function startRecaptcha(
  {executeRecaptcha}: IGoogleReCaptchaConsumerProps,
  action: string
): Promise<string> {
  if (!executeRecaptcha) {
    throw new Error('recaptcha not ready');
  }
  return await executeRecaptcha(action);
}

export default startRecaptcha;
