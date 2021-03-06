/* eslint-disable no-restricted-globals */
export const required = (value) => (
  value ? undefined : 'Required'
)

export const rgpd = (value) => (
  value ? undefined : "L'acceptation de la politique de confidentialité est requise"
)

export const maxLength = (max) => (value) => (
  value && value.length > max ? `Must be ${max} characters or less.` : undefined
)

export const minLength = (min) => (value) => (
  value && value.length < min ? `Must be ${min} characters or more.` : undefined
)

export const minLengthWithoutHTML = (min) => (value) => {
  const newValue = value && value.replace(/<\/?[a-z][a-z0-9]*[^<>]*>/gi, '')
  return newValue && newValue.length < min ? `Must be ${min} characters or more.` : undefined
}

export const isNumber = (value) => {
  return value === undefined && isNaN(Number(value)) ? 'Must be a number.' : undefined
}

export const minValue = (min) => (value) => {
  return value && value < min ? `Must be at least ${min}.` : undefined
}

export const maxValue = (max) => (value) => (
  value && value > max ? `Il doit être au maximum ${max}.` : undefined
)

export const isEmail = (value) => (
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address.'
    : undefined
)

export const tooOld = (value) => (
  value && value > 65 ? 'You might be too old for this.' : undefined
)

export const alphaNumeric = (value) => (
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? 'Only alphanumeric characters.'
    : undefined
)

export const isMatchPassword = (matchName) => (value, allValues) => {
  const match = allValues[matchName]
  if (value !== match) {
    return 'Passwords do not match.'
  }
  return null
}

// one or the other field required -> used on search_ads_form
export const eitherOr = (otherField) => (value, allValues) => {
  if (value === undefined && allValues[otherField] === undefined) {
    return `One of ${otherField} or this field is required.`
  }
  return null
}

export const isPlaceFormat = (value) => {
  const regexp = /[a-z\s]+-[\d]+/g
  if (value) {
    return !value.match(regexp) ? 'City/postal code invalid.' : undefined
  }
  return null
}

export const isSpace = (value) => (
  value && /\s/.test(value)
    ? 'Spaces are not allowed'
    : null
)

export const isOnlySpace = (value) => (
  value && /^ *$/.test(value)
    ? 'Invalid input'
    : null
)

export const isNotMatchCurrentEmail = (matchName) => (value, allValues) => {
  const match = allValues[matchName]
  if (value === match) {
    return 'Aucune modification'
  }
  return null
}

export const isTag = (value) => {
  if (value.includes('>') || value.includes('<')) {
    return 'Saisie contient des caractères non valides <>'
  }
  return null
}

export const frenchAmount = (value) => (
  value && /^\d+(?:\.\d{1,2})?$/i.test(value)
    ? 'Montant invalide'
    : undefined
)

export const passwordReq = (value) => {
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{10,})/
  if (value && !reg.test(value)) {
    return 'Password must have minimum 10 characters and contain at least: 1 number, 1 letter, 1 capital letter and one symbol !@#$%^&*'
  }
  return null
}
