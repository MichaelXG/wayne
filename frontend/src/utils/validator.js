// ✅ Valida senha com requisitos mínimos
export function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&\-_.])[^\s]{12,}$/;

  if (!passwordRegex.test(password)) {
    return 'Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&-_.). Spaces are not allowed.';
  }

  return null;
}

// 🔐 Cria um hash para validação personalizada (opcional)
export function makeHashValue(user, timestamp) {
  return String(user.pk) + String(timestamp) + String(user.is_active);
}

// 🔍 Valida o token com base no timestamp separado
export function checkToken(token, timestamp) {
  console.log('🔐 checkToken called with:', token, timestamp);

  if (!token || !timestamp || isNaN(timestamp)) {
    console.warn('❌ Invalid token or timestamp');
    return false;
  }

  try {
    if (!validateTokenStructure(token)) {
      console.warn('❌ Token structure invalid');
      return false;
    }

    const currentTimestamp = Date.now();
    const timeDifference = Math.abs(currentTimestamp - Number(timestamp));
    const tokenIsValid = timeDifference <= 30 * 60 * 1000; // 30 min

    console.log(`🕒 Token is ${tokenIsValid ? 'valid' : 'expired'} (within 30 minutes)`);
    return tokenIsValid;
  } catch (error) {
    console.error('❌ Error checking token:', error);
    return false;
  }
}

// 🔎 Valida estrutura do token
export function validateTokenStructure(token) {
  const hashRegex = /^[a-z0-9-]{20,64}$/i; // permite hífen e letras
  if (!hashRegex.test(token)) {
    console.log('❌ Invalid token format.');
    return false;
  }
  return true;
}

// 🔓 Decodifica string Base64 de forma segura
export function decodeBase64(str) {
  try {
    if (!str || typeof str !== 'string') {
      throw new Error('Invalid input for Base64 decoding.');
    }

    const sanitizedStr = str.replace(/-/g, '+').replace(/_/g, '/');
    let paddedStr = sanitizedStr;
    while (paddedStr.length % 4 !== 0) {
      paddedStr += '=';
    }

    const decodedBytes = atob(paddedStr);
    const textDecoder = new TextDecoder('utf-8');
    return textDecoder.decode(new Uint8Array([...decodedBytes].map((char) => char.charCodeAt(0))));
  } catch (error) {
    console.error('Error decoding Base64:', error instanceof Error ? error.message : error);
    return '';
  }
}

export function formatPhone(phone) {
  if (!phone) return 'N/A';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  }
  return phone;
}

export function maskCPFGPT(cpf) {
  if (!cpf) return 'N/A';
  const digits = cpf.replace(/\D/g, '');
  if (digits.length !== 11) return 'CPF inválido';
  return `${digits.substring(0, 3)}.***.***-${digits.substring(9)}`;
}

export function formatCep(cep) {
  if (!cep) return '-';
  const raw = cep.replace(/\D/g, '');
  return raw.length === 8 ? raw.replace(/^(\d{5})(\d{3})$/, '$1-$2') : raw;
}

export function isTokenTimestampValid(timestamp) {
  const now = Date.now();
  const diff = Math.abs(now - Number(timestamp));
  return diff <= 30 * 60 * 1000; // 30 minutes
}

export function formatDate(date, locale = 'us') {
  if (!date) return 'dd/mm/yyyy';
  const d = new Date(date);
  return isNaN(d) ? 'dd/mm/yyyy' : d.toLocaleDateString(locale);
}
