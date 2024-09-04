var chubLocation = "html"
var chubDev = true

// ---

const i_ = async i => (await import(i)).default
var Imports = Promise.all([
  i_('/js/imp.js'),
])

// ---

ChubML.body = ChubML.parse(`
nav @*wrp=b @*wrp=i;
  "Please wait </b>";
  span;
    "while we load the page...";
`)

// ---

let pageSrc = 'beam.lmc'
ChubML.beamMake(pageSrc)
  .then(
    ({ doc }) => ChubML.beamRender(doc, chubLocation)
  )

// ---

// On injectChub finished.
var chubinjected = async (event) => {
  { ['css/style.css'].forEach(importStyle) }

  await Imports;
  import('/js/entry.js')

  window.__cml_served = event
}