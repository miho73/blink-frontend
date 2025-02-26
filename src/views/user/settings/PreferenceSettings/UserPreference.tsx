import {FormSection} from "../../../form/Form.tsx";
import AllergySettings from "./AllergySettings.tsx";

function PreferenceSettings() {
  return (
    <FormSection title={'개인 설정'}>
      <AllergySettings/>
    </FormSection>
  );
}

export default PreferenceSettings;
