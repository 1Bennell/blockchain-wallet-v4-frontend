import React from 'react'
import { Field, reduxForm } from 'redux-form'

import { SelectBoxLanguages } from 'components/Form'
import { SettingSelectBoxWrapper } from 'components/Setting'

const Settings = (props) => (
  <SettingSelectBoxWrapper>
    <Field name='language' component={SelectBoxLanguages} />
  </SettingSelectBoxWrapper>
)

export default reduxForm({ form: 'settingLanguage' })(Settings)
