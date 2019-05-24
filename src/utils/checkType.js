
var typeName = {
  '[object Function]': 'function',
  '[object Boolean]': 'boolean',
  '[object Number]': 'number',
  '[object String]': 'string',
  '[object Object]': 'object',
  '[object RegExp]': 'regExp',
  '[object Array]': 'array',
  '[object Error]': 'error',
  '[object Date]': 'date'
}

function checkType (obj) {
  if (obj == null) {
    return String(obj)
  }
  return typeof obj === 'object' || typeof obj === 'function' ? typeName[Object.prototype.toString.call(obj)] : typeof obj;
}

export default {
  checkType
}
