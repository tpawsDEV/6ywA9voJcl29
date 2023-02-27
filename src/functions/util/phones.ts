/**
 * @author Rafael Mourao
 * @param phone string
 * @returns formatted phone (length == 12, format: [55][31][12345678])
 */
const formatPhone = (phone: string) => {
  let formattedPhone = phone
    .replaceAll(' ', '')
    .replaceAll('(', '')
    .replaceAll(')', '')
    .replaceAll('-', '')
    .replaceAll('+', '')
    .replaceAll('@', '');

  // Adicionar o 55 (se necessario):
  if (
    formattedPhone.substring(0, 2) != '55' || // se nao tem o 55
    phone.length == 10 || phone.length == 11 // se tem o 55 como DDD
  ) {
    formattedPhone = '55' + formattedPhone; // adicionar 55 no inicio
  }

  // Remover o 0, caso o DDD esteja no formato 031:
  if (formattedPhone.charAt(2) == '0') formattedPhone = formattedPhone.replace('0', '');

  // Remover o 9 (se necessario):
  if (formattedPhone.length == 13) formattedPhone = formattedPhone.substring(0, 4) + formattedPhone.substring(5);

  return formattedPhone;
}

/**
 * @author Rafael Mourao
 * @param phone string
 * @returns boolean
 */
const isValidPhone = (phone: string) => {
  const formattedPhone = formatPhone(phone);
  return formattedPhone.length == 12  &&  /[\D]/g.test(formattedPhone)==false;
}


/**
 * Formata uma funcao para poder ser injetado no doc HTML
 * @author Rafael Mourao
 * @param func Function
 * @returns string
 */
const formatFunction = (func: Function) => {
  const commentRegex = /\/\/.*\\n/g;
  const formattedFunction = func.toString()
    .replaceAll(commentRegex, '')
    .replaceAll('\\n', '')
    .replaceAll('\\t', ' ');
  
  return formattedFunction;
}

/**
 * Injeta a funcao formatPhone para o doc HTML
 * @author Rafael Mourao
 */
const injectFormatPhoneFunction = () => {
  const toInject = formatFunction(formatPhone);

  const script = document.createElement('script');
  script.textContent = 'var formatPhone = ' + toInject;
  document.documentElement.appendChild(script);
}

/**
 * Injeta a funcao isValidPhone para o doc HTML
 * @author Rafael Mourao
 */
const injectIsValidPhone = () => {
  const toInject = formatFunction(isValidPhone);

  const script = document.createElement('script');
  script.textContent = 'var isValidPhone = ' + toInject;
  document.documentElement.appendChild(script);
}

export { formatPhone, isValidPhone, injectFormatPhoneFunction, injectIsValidPhone };