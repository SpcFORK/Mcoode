function globalize(obj) { return globalThis[obj.name] = obj }

function importStyle(href = '') {
  return document.head.appendChild(Object.assign(
    document.createElement('link'),
    { href, rel: 'stylesheet', type: 'text/css' }
  ))
}

function importScript(src = '', type = '', async = false, innerHTML = '') {
  return document.head.appendChild(Object.assign(
    document.createElement('script'),
    { src, type, async, innerHTML }
  ))
}

function Release(eobj, webGlobal) {
  // Web
  try { window; globalize(Object.setPrototypeOf({ name: webGlobal }, eobj)) } catch { }
  // Node
  try { process; module.exports = eobj } catch { }
}

// ---
{
  [globalize, importStyle, importScript, Release].forEach(globalize)
}

export default Release({
  globalize,
  importStyle,
  importScript,
  Release
}, 'CowImp')