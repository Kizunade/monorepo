export function usePetHelper() {
  const typeOptions = [
    { label: '猫', value: 'cat' },
    { label: '狗', value: 'dog' },
  ]

  const genderOptions = [
    { label: '公', value: 'male' },
    { label: '母', value: 'female' },
  ]

  const fallbackCatBreeds = [
    { label: '布偶猫', value: '布偶猫' },
    { label: '英短', value: '英短' },
    { label: '美短', value: '美短' },
    { label: '加菲猫', value: '加菲猫' },
    { label: '中华田园猫', value: '中华田园猫' },
  ]

  const fallbackDogBreeds = [
    { label: '金毛', value: '金毛' },
    { label: '拉布拉多', value: '拉布拉多' },
    { label: '柯基', value: '柯基' },
    { label: '柴犬', value: '柴犬' },
    { label: '边牧', value: '边牧' },
    { label: '泰迪', value: '泰迪' },
  ]

  function getLabel(value: string | undefined, options: { label: string, value: string }[]) {
    if (!value)
      return ''
    return options.find(i => i.value === value)?.label || ''
  }

  function getTypeLabel(type: string) {
    return getLabel(type, typeOptions)
  }

  function getGenderLabel(gender: string) {
    return getLabel(gender, genderOptions)
  }

  function getDefaultAvatar(type: string) {
    return type === 'cat'
      ? 'https://placecats.com/200/200'
      : 'https://placedog.net/200/200'
  }

  function getPetAge(birthday: number | undefined | null) {
    if (!birthday)
      return '-'
    const birth = new Date(birthday)
    const now = new Date()
    let years = now.getFullYear() - birth.getFullYear()
    let months = now.getMonth() - birth.getMonth()
    if (months < 0) {
      years--
      months += 12
    }
    if (years < 0)
      return '0个月'
    if (years === 0 && months === 0)
      return '未满月'
    if (years === 0)
      return `${months}个月`
    if (months === 0)
      return `${years}岁`
    return `${years}岁${months}个月`
  }

  return {
    typeOptions,
    genderOptions,
    fallbackCatBreeds,
    fallbackDogBreeds,
    getTypeLabel,
    getGenderLabel,
    getDefaultAvatar,
    getPetAge,
  }
}
