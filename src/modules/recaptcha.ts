import {IGoogleReCaptchaConsumerProps} from "react-google-recaptcha-v3";

async function startRecaptcha(
  {executeRecaptcha}: IGoogleReCaptchaConsumerProps,
  action: string
): Promise<string> {
  if (!executeRecaptcha) {
    throw new Error('recaptcha not ready');
  }

  // FIXME: ERROR THROWN HERE DOES NOT TRIGGER UPPER CATCH BLOCK
  return await executeRecaptcha(action);
}

export default startRecaptcha;
