/* Auhd#!
@Author: spectcow
@Date: 2024-08-19 20:16:00
*/

// @@ Display

let q = document
let mc_container = ChubML.$('mc_container')

function clearDisplay() { return mc_container.innerHTML = '' }
function render(html = '') { return mc_container.innerHTML = html }

/**
 * Checks if the given value is `null` or `undefined`, and throws an error with the given message if so.
 *
 * @param {any} val - The value to check.
 * @param {string} msg - The error message to throw if the value is void.
 * @returns {any} The passed-in value if it is not void.
 * @throws Will throw an error with the provided message if the value is `null` or `undefined`.
 */
function throwIfOddFalsey(val, msg) {
  switch (val) {
    case null:
    case false:
    case void 0: Throw(msg)
    default: return val
  }
}

/**
 * Asserts a value is not void (null or undefined) within a new thread.
 *
 * @param {[any, string]} assertion - An array where the first element is the value and the second is the message and the.
 * @returns {Thread<any>} A new thread that resolves to the value.
 */
function MC_Thread_Assert([val, msg]) { return Thread((resolve) => resolve(throwIfOddFalsey(val, msg))) }

/**
 * @typedef {[any, string]} AssertionEntries - Denotes entries comprising an error message and a value.
 * 
 * @param {AssertionEntries[]} entries - The array of entries to evaluate.
 * @returns {Promise<any[]>} A promise resolved when all assertions complete.
 */
function MC_Thread_AssertAll(entries = []) { return Promise.all(entries.map(MC_Thread_Assert)) }

function MC_make_pngURI(imgData) {
  return `data:image/png;base64,${imgData}`
}

// ---
// @@ Renderer

const MC_Image_Renderer_src = () => ChubML.parse(`
mc_image_renderer;
  mc_header;
    h3 .center_text;
      "MC Generator";

  hr .holomini;

  mc_output_container .center_container;
    img .mc_output_img %src=_;
  hr .holomini;

  hr .imini;

  section .mc_inputs;
    section .mc_gen_inputs .center_container;

      input .mc_gen_import_input %oninput=MC_input_gen_import_mc(this) 
      %type=file %accept=image/* %multiple=false;

      input .mc_gen_do_input %oninput=MC_input_gen_oninput(this) %value=Hello|there;

      hr .imini;

      button %onclick=MC_generate(this);
        "Generate";

    // section .mc_gen_import_mc .center_container;

    hr .imini;
    hr .holomini;
    hr .imini;

    section .mc_option_inputs;
      section .mc_option_inputs_wh .center_container;
        label .mc_w_option_label;
          "w:";
        hr .imini;

        input .mc_h_option_label %oninput=MC_input_w_oninput(this)
        %type=number %value=${mc_wh[0]} %min=1 %max=2000;

        hr .imini;

        label .mc_h_option_label;
          "h:";
        hr .imini;

        input .mc_h_option_input %oninput=MC_input_h_oninput(this)
        %type=number %value=${mc_wh[1]} %min=1 %max=2000;

      hr .imini;

      section .mc_option_inputs_pad .center_container;

        label .mc_hep_option_label;
          "header enc. pad:";
        hr .imini;

        input .mc_hep_option_input %oninput=MC_input_hep_oninput(this)
        %type=number %value=${MC_header_encoding_size} %min=1 %max=99999;

        hr .imini;

        label .mc_bep_option_label;
          "body enc. pad:";
        hr .imini;

        input .mc_bep_option_input %oninput=MC_input_bep_oninput(this)
        %type=number %value=${MC_encoding_size} %min=1 %max=99999;

  hr .imini;

  hr .holomini;

  section .mc_meta;
    code .mc_meta_code;
      "Begin typing!";
`)

class MC_Image_Renderer {
  container = ChubML.$('mc_image_renderer')

  header = ChubML.$('mc_header')

  output_container =
    ChubML.$('mc_output_container')
  output_img =
    ChubML.$('.mc_output_img')

  meta =
    ChubML.$('.mc_meta')
  meta_code =
    ChubML.$('.mc_meta_code')

  inputs = ChubML.$('.mc_inputs')

  gen_inputs = ChubML.$('.mc_gen_inputs')

  import_input =
    ChubML.$('.mc_gen_inputs .mc_gen_import_input')
  input =
    ChubML.$('.mc_gen_inputs .mc_gen_do_input')
  button =
    ChubML.$('.mc_gen_inputs button')

  option_inputs = ChubML.$('.mc_option_inputs')

  option_inputs_wh =
    ChubML.$('.mc_option_inputs_wh')

  w_option_label =
    ChubML.$('.mc_w_option_label')
  w_option_input =
    ChubML.$('.mc_w_option_input')

  h_option_label =
    ChubML.$('.mc_h_option_label')
  h_option_input =
    ChubML.$('.mc_h_option_input')

  option_inputs_pad =
    ChubML.$('.mc_option_inputs_pad')

  hep_option_label =
    ChubML.$('.mc_hep_option_label')
  hep_option_input =
    ChubML.$('.mc_hep_option_input')

  bep_option_label =
    ChubML.$('.mc_bep_option_label')
  bep_option_input =
    ChubML.$('.mc_bep_option_input')
}

function MC_display_Image_Renderer() {
  render(MC_Image_Renderer_src())
  return new MC_Image_Renderer
}

// ---
// @@ Generator

/**
 * Create a canvas element with the given width and height.
 * @param {number} width - The width of the canvas.
 * @param {number} height - The height of the canvas.
 * @returns {HTMLCanvasElement} The created canvas element.
 */
function MC_create_canvas(width, height) {
  MC_Thread_AssertAll([
    [width, 'MC_create_canvas: width must be a number'],
    [height, 'MC_create_canvas: height must be a number'],
  ])
  return Object.assign(
    document.createElement('canvas'),
    { width, height }
  )
}

/**
 * Get the rendering context of the canvas.
 * @param {HTMLCanvasElement} canvas - The canvas element.
 * @param {string} [type='2d'] - The context type.
 * @returns {CanvasRenderingContext2D} The rendering context.
 */
function MC_get_ctx(canvas, type = '2d') {
  MC_Thread_AssertAll([
    [canvas, 'Canvas element is null.'],
    [canvas.getContext, 'Canvas element does not have a context.'],
  ])
  const ctx = canvas.getContext(type)
  MC_Thread_Assert([ctx, 'Canvas element does not have a valid context.'])
  return ctx
}

/**
 * Convert the canvas content to a Data URI.
 * @param {HTMLCanvasElement} canvas - The canvas to convert.
 * @param {number} qual - The quality of the output image.
 * @returns {string} The Data URI of the canvas content.
 */
function MC_canvas_dataURI(canvas, qual) {
  MC_Thread_Assert([canvas, 'Canvas element is null.']);
  return canvas.toDataURL('image/png', qual)
}

/**
 * Create an array representing a pixel with RGBA color values.
 * @param {number} [r=0] - Red value (0-255).
 * @param {number} [g=0] - Green value (0-255).
 * @param {number} [b=0] - Blue value (0-255).
 * @param {number} [a=255] - Alpha value (0-255).
 * @returns {[number, number, number, number]} An array with [r, g, b, a].
 */
function MC_Pixel(r = 0, g = 0, b = 0, a = 255) {
  MC_Thread_AssertAll([
    [r, 'MC_Pixel: Invalid red value'],
    [g, 'MC_Pixel: Invalid green value'],
    [b, 'MC_Pixel: Invalid blue value'],
    [a, 'MC_Pixel: Invalid alpha value'],
  ])
  return [r, g, b, a]
}

/**
 * Set the fill style for the rendering context.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to set the fill style for.
 * @param {[number, number, number, number]} [color=[0, 0, 0, 255]] - An array containing the RGBA color values.
 * @returns {string} The rgba color string assigned to the fill style.
 */
function MC_set_fillStyle(ctx, [r, g, b, a] = [0, 0, 0, 255]) {
  MC_Thread_Assert([ctx, 'MC_set_fillStyle: Invalid context.'])
  return ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
}

/**
 * Set the border size for the rendering context.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to set the border size for.
 * @param {number} size - The size of the border.
 * @returns {number} The assigned border size.
 */
function MC_set_borderSize(ctx, size) {
  MC_Thread_AssertAll([
    [ctx, 'MC_set_borderSize: Invalid context.'],
    [size, 'MC_set_borderSize: Invalid border size.'],
  ])
  return ctx.lineWidth = size
}

/**
 * Set the border color for the rendering context.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to set the border color for.
 * @param {[number, number, number, number]} [color=[0, 0, 0, 255]] - An array containing the RGBA color values.
 * @returns {string} The rgba color string assigned to the fill style.
 */
function MC_set_borderColor(ctx, [r, g, b, a] = [0, 0, 0, 255]) {
  MC_Thread_Assert([ctx, 'MC_set_borderColor: Invalid context.'])
  return MC_set_fillStyle(ctx, [r, g, b, a])
}

/**
 * Set a pixel at the specified coordinates with the given color.
 * @param {CanvasRenderingContext2D} ctx - The rendering context.
 * @param {[number, number]} coordinates - The [x, y] coordinates of the pixel.
 * @param {[number, number, number, number]} color - The [r, g, b, a] color values.
 */
function MC_set_pixel(ctx, [x, y] = [0, 0], [r, g, b, a] = [0, 0, 0, 0]) {
  MC_Thread_AssertAll([
    [ctx, 'MC_set_pixel: Invalid context.'],
    [x, 'MC_set_pixel: Invalid x coordinate.'],
    [y, 'MC_set_pixel: Invalid y coordinate.'],
  ])
  MC_set_fillStyle(ctx, [r, g, b, a])
  ctx.fillRect(x, y, 1, 1)
}

/**
 * Set the pixel color for a flat index in the canvas context.
 * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
 * @param {number} i - The flat index of the pixel.
 * @param {[number, number, number, number]} color - The [r, g, b, a] color values for the pixel.
 */
function MC_flat_set_pixel(ctx, i = 0, [r, g, b, a] = [0, 0, 0, 0], mx = ctx.canvas.width) {
  MC_Thread_Assert([ctx, 'MC_flat_set_pixel: Invalid context.'])
  MC_set_fillStyle(ctx, [r, g, b, a])
  ctx.fillRect(i % mx, Math.floor(i / mx), 1, 1)
}

/**
 * Checks if a given index is within the safe bounds of a flattened grid.
 *
 * @param {number} i - The index to check.
 * @param {number} w - The width of the grid.
 * @param {number} h - The height of the grid.
 * @returns {boolean} True if the index is within bounds, false otherwise.
 */
function MC_flat_safeSize(i, w, h) { return i < (w * h) }

/**
 * Get the color data of a pixel at the specified coordinates.
 * @param {CanvasRenderingContext2D} ctx - The rendering context.
 * @param {[number, number]} coordinates - The [x, y] coordinates of the pixel.
 * @returns {Uint8ClampedArray} The color data of the pixel.
 */
function MC_get_pixel(ctx, [x, y] = [0, 0]) {
  MC_Thread_Assert([ctx, 'MC_get_pixel: Invalid context.'])
  return ctx.getImageData(x, y, 1, 1).data
}

/**
 * Draw a line on the canvas.
 * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
 * @param {[number, number]} start - The starting [x, y] coordinates of the line.
 * @param {[number, number]} end - The ending [x, y] coordinates of the line.
 * @param {[number, number, number, number]} [color=[0, 0, 0, 0]] - The [r, g, b, a] color values for the line.
 */
function MC_line(ctx, [x1, y1], [x2, y2], [r, g, b, a] = [0, 0, 0, 0]) {
  MC_Thread_AssertAll([
    [ctx, 'MC_line: Invalid context.'],
    [x1, 'MC_line: Invalid x1 coordinate.'],
    [y1, 'MC_line: Invalid y1 coordinate.'],
    [x2, 'MC_line: Invalid x2 coordinate.'],
    [y2, 'MC_line: Invalid y2 coordinate.'],
  ])
  MC_set_fillStyle(ctx, [r, g, b, a])
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
  ctx.closePath()
}

/**
 * @typedef {[number, number, number, number]} ColorArray - An array with four numeric values representing RGBA color.
 * @typedef {{ color: ColorArray, char: string }} ColorToCharEntry - An object with color array and character.
 */
class MC_ColorToCharMap {
  /**
   * Constructs a color-to-character map structure.
   * @param {string} char - The character to map.
   * @param {...number} rest - The rest values representing the color components.
   * @returns {ColorToCharEntry} The constructed color-to-character map structure.
   */
  static #CTC_struct(char, ...rest) { return { color: MC_Pixel(...rest), char } }
  static map = {
    // @@ Number colors
    "White":
      MC_ColorToCharMap.#CTC_struct('0', 255, 255, 255),
    "Bright Red":
      MC_ColorToCharMap.#CTC_struct('1', 255, 0, 0),
    "Lime Green":
      MC_ColorToCharMap.#CTC_struct('2', 50, 205, 50),
    "Sunshine Yellow":
      MC_ColorToCharMap.#CTC_struct('3', 255, 215, 0),
    "Hot Pink":
      MC_ColorToCharMap.#CTC_struct('4', 255, 105, 180),
    "Cyan":
      MC_ColorToCharMap.#CTC_struct('5', 0, 255, 255),
    "Orange":
      MC_ColorToCharMap.#CTC_struct('6', 255, 165, 0),
    "Purple":
      MC_ColorToCharMap.#CTC_struct('7', 128, 0, 128),
    "Magenta":
      MC_ColorToCharMap.#CTC_struct('8', 255, 0, 255),
    "Neon Green":
      MC_ColorToCharMap.#CTC_struct('9', 57, 255, 20),
    "Scarlet":
      MC_ColorToCharMap.#CTC_struct('a', 255, 36, 0),
    "Deep Sky Blue":
      MC_ColorToCharMap.#CTC_struct('b', 0, 191, 255),
    "Forest Green":
      MC_ColorToCharMap.#CTC_struct('c', 34, 139, 34),
    "Turquoise":
      MC_ColorToCharMap.#CTC_struct('d', 64, 224, 208),
    "Coral":
      MC_ColorToCharMap.#CTC_struct('e', 255, 127, 80),
    "Gold":
      MC_ColorToCharMap.#CTC_struct('f', 255, 215, 0),
    "Indigo":
      MC_ColorToCharMap.#CTC_struct('g', 75, 0, 130),
    "Lavender":
      MC_ColorToCharMap.#CTC_struct('h', 230, 230, 250),
    "Bright Violet":
      MC_ColorToCharMap.#CTC_struct('i', 138, 43, 226),
    "Fuchsia":
      MC_ColorToCharMap.#CTC_struct('j', 255, 0, 255),
    "Ruby Red":
      MC_ColorToCharMap.#CTC_struct('k', 155, 17, 30),
    "Sky Blue":
      MC_ColorToCharMap.#CTC_struct('l', 135, 206, 235),
    "Aquamarine":
      MC_ColorToCharMap.#CTC_struct('m', 127, 255, 212),
    "Bright Orange":
      MC_ColorToCharMap.#CTC_struct('n', 255, 69, 0),
    "Periwinkle":
      MC_ColorToCharMap.#CTC_struct('o', 204, 204, 255),
    "Bright Yellow":
      MC_ColorToCharMap.#CTC_struct('p', 255, 255, 0),
    "Electric Lime":
      MC_ColorToCharMap.#CTC_struct('q', 204, 255, 0),
    "Crimson":
      MC_ColorToCharMap.#CTC_struct('r', 220, 20, 60),
    "Teal":
      MC_ColorToCharMap.#CTC_struct('s', 0, 128, 128),
    "Hot Magenta":
      MC_ColorToCharMap.#CTC_struct('t', 255, 0, 204),
    "Neon Blue":
      MC_ColorToCharMap.#CTC_struct('u', 31, 81, 255),
    "Bright Coral":
      MC_ColorToCharMap.#CTC_struct('v', 255, 111, 97),
    "Chartreuse":
      MC_ColorToCharMap.#CTC_struct('w', 127, 255, 0),
    "Plum":
      MC_ColorToCharMap.#CTC_struct('x', 221, 160, 221),
    "Bright Turquoise":
      MC_ColorToCharMap.#CTC_struct('y', 0, 206, 209),
    "Electric Purple":
      MC_ColorToCharMap.#CTC_struct('z', 191, 0, 255)
  }

  /**
   * Get the character associated with a given color.
   * @param {string} color - The color key to look up.
   * @returns {ColorToCharEntry} The mapped color-to-character structure.
   */
  static get(color) {
    this.#get_error(color)
    let colorAsset = MC_ColorToCharMap.map[color]
    this.#get_error(colorAsset)
    return colorAsset
  }
  static #get_error(e) { MC_Thread_Assert([e, 'Invalid color key.']) }

  /**
   * Locate the first map entry that matches a given callback condition.
   * @param {(entry: [string, ColorToCharEntry], index: number, array: [string, ColorToCharEntry][]) => boolean} cb - The callback function used for the search.
   * @returns {[string, ColorToCharEntry]} The first entry that satisfies the callback condition.
   */
  static find(cb) {
    this.#find_error(cb)
    let colorAsset = Object.entries(MC_ColorToCharMap.map).find(cb)
    this.#find_error(colorAsset)
    return colorAsset
  }
  static #find_error(e) { MC_Thread_Assert([e, 'Invalid callback function.']) }

  /**
   * Locate the first map entry that matches a given character.
   * @param {string} character - The character to search for.
   * @returns {[string, ColorToCharEntry]} The entry with the provided character.
   */
  static findCharEntry(character) {
    this.#findCharEntry_error(character)
    let colorAsset = MC_ColorToCharMap.find(entry => entry[1].char === character)
    this.#findCharEntry_error(colorAsset)
    return colorAsset
  }
  static #findCharEntry_error(e) { MC_Thread_Assert([e, 'Invalid character.']) }

  /**
   * Find the first map entry that has a matching color.
   * @param {ColorArray} color - The color array to match.
   * @returns {[string, ColorToCharEntry]} The entry with the provided color.
   */
  static findColorEntry(color) {
    this.#findColorEntry_error(color)
    let colorAsset = MC_ColorToCharMap.find(entry => entry[1].color === color)
    this.#findColorEntry_error(colorAsset)
    return colorAsset
  }
  static #findColorEntry_error(e) { MC_Thread_Assert([e, 'Invalid color.']) }

  /**
   * Find the color name for the given color array.
   * @param {ColorArray} color - The color array to search for.
   * @returns {string} The name of the color found in the map.
   */
  static findColorName(color) {
    this.#findColorName_error(color)
    let colorAsset = MC_ColorToCharMap.findColorEntry(color)
    this.#findColorName_error(colorAsset)
    return colorAsset?.[0]
  }
  static #findColorName_error(e) { MC_Thread_Assert([e, 'Invalid color.']) }

  /**
   * Find the color name associated with the provided character.
   * @param {string} character - The character to search for.
   * @returns {string} The name of the color associated with the character.
   */
  static findCharColorName(character) {
    this.#findCharColorName_error(character)
    let colorAsset = MC_ColorToCharMap.findCharEntry(character)
    this.#findCharColorName_error(colorAsset)
    return colorAsset?.[0]
  }
  static #findCharColorName_error(e) { MC_Thread_Assert([e, 'Invalid character.']) }

  /**
   * Retrieve the color structure for the given color array.
   * @param {ColorArray} color - The color array to search for.
   * @returns {ColorToCharEntry} The color-to-character entry found in the map.
   */
  static findColor(color) {
    this.#findColor_error(color)
    let colorAsset = MC_ColorToCharMap.findColorEntry(color)
    this.#findColor_error(colorAsset)
    return colorAsset?.[1]
  }
  static #findColor_error(e) { MC_Thread_Assert([e, 'Invalid color.']) }

  /**
   * Retrieve the character structure for the specified character.
   * @param {string} character - The character to search for.
   * @returns {ColorToCharEntry} The color-to-character entry found in the map.
   */
  static findChar(character) {
    this.#findChar_error(character)
    let colorAsset = MC_ColorToCharMap.findCharEntry(character)
    this.#findChar_error(colorAsset)
    return colorAsset?.[1]
  }
  static #findChar_error(e) { MC_Thread_Assert([e, 'Invalid character.']) }

  /**
   * Retrieves the color component of the given color.
   * @param {ColorArray} color - The color to lookup.
   * @returns {ColorArray} The color component.
   */
  static findColorColor(color) { return MC_ColorToCharMap.findColor(color).color }

  /**
   * Retrieves the character component of the given color.
   * @param {ColorArray} color - The color to lookup.
   * @returns {string} The character component.
   */
  static findColorChar(color) { return MC_ColorToCharMap.findColor(color).char }

  /**
   * Retrieves the color component of the given character.
   * @param {string} character - The character to lookup.
   * @returns {ColorArray} The color component.
   */
  static findCharColor(character) { return MC_ColorToCharMap.findChar(character).color }

  /**
   * Retrieves the character component of the given character.
   * @param {string} character - The character to lookup.
   * @returns {string} The character component.
   */
  static findCharChar(character) { return MC_ColorToCharMap.findChar(character).char }
}

// ---
// @@ Generator

let mc_wh = [16 * 2, 40]
let MC_encoding_size = 4
let MC_header_encoding_size = 2

const MC_tl_corner = ({ length }) => [
  `MCv1`,
  `es: ${MC_encoding_size}`,
  `tl: ${length}`,
  `wh: ${mc_wh[0]} ${mc_wh[1]}`,
  `mx: ${mc_wh[0] * mc_wh[1]}`,
]

function MC_update_bottom_feed() {
  let len = renderer.input.value.length
  renderer.meta_code.innerHTML = `Presumed Head:<br>
    ${MC_tl_corner({ length: len * (MC_encoding_size / 2) }).join(' ')}
  `
}

globalize(function MC_generate() {
  const canvas = MC_create_canvas(...mc_wh)
  const ctx = MC_get_ctx(canvas)

  MC_handle_generate(canvas, ctx)

  renderer.output_img.src = MC_canvas_dataURI(canvas)
})

globalize(function MC_input_gen_oninput() {
  MC_update_bottom_feed()
})

globalize(function MC_input_w_oninput(wi) {
  MC_update_bottom_feed()

  mc_wh[0] = parseInt(wi.value)
})

globalize(function MC_input_h_oninput(hi) {
  MC_update_bottom_feed()

  mc_wh[1] = parseInt(hi.value)
})

globalize(function MC_input_hep_oninput(hi) {
  MC_update_bottom_feed()

  MC_header_encoding_size = parseInt(hi.value)
})

globalize(function MC_input_bep_oninput(bi) {
  MC_update_bottom_feed()

  MC_encoding_size = parseInt(bi.value)
})

// ---
// @@ Codec

/**
 * Encode a text by mapping each character to its corresponding color value.
 *
 * @param {string} text - The text to encode.
 * @returns {Array<ColorArray>} An array of color arrays corresponding to the characters.
 */
function MC_encode_text(text) {
  MC_Thread_Assert([text, 'Invalid text.'])
  return text.split('').map(MC_ColorToCharMap.findCharColor)
}

/**
 * Decode an array of color values back to their corresponding characters.
 *
 * @param {Array<ColorArray>} triparr - The array of color values to decode.
 * @returns {string} The decoded text.
 */
function MC_decode_color_arr(triparr) {
  MC_Thread_Assert([triparr, 'Invalid triparr.'])
  return triparr.map(MC_ColorToCharMap.findColorChar)
}

/**
 * Convert each character in the string to its binary representation.
 * @param {string} str - The string to be converted.
 * @returns {string} The binary representation of the string.
 */
function MC_toB36(str, size = MC_encoding_size) {
  MC_Thread_Assert([str, 'Invalid string.'])
  return str
    .split(/(?=[^])/)
    .map(c => c.charCodeAt(0).toString(36).padStart(size, '0'))
    .join('')
}

/**
 * Convert a binary string back to the original string.
 * @param {string} str - The binary string to be converted.
 * @returns {string} The original string.
 */
function MC_fromB36(str, size = MC_encoding_size) {
  MC_Thread_Assert([str, 'Invalid string.'])
  return str
    .match(new RegExp(`[^]{${size} } `, 'g'))
    .map(c => String.fromCharCode(parseInt(c, 36)))
    .join('')
}

/**
 * Compresses and converts text to base 36 encoding.
 *
 * @param {string} text - The text to be encoded.
 * @param {number} [pd=MC_encoding_size] - The padding size to use in encoding.
 * @returns {string} The encoded text.
 */
function MC_packText(text, pd = MC_encoding_size) {
  let lzwOut = lzw.lzwCompress(text),
    ebloatOut = MC_toB36(lzwOut, pd)
  console.log({ text, ebloatOut, lzwOut })
  return ebloatOut
}

/**
 * Decompresses and converts base 36 encoded text back to its original form.
 *
 * @param {string} ebloatOut - The encoded text to be decoded.
 * @param {number} [pd=MC_encoding_size] - The padding size used in decoding.
 * @returns {string} The decoded original text.
 */
function MC_unpackText(ebloatOut, pd = MC_encoding_size) {
  let lzwOut = MC_fromB36(ebloatOut, pd),
    text = lzw.lzwDecompress(lzwOut)
  console.log({ text, ebloatOut, lzwOut })
  return text
}

/**
 * Compresses and converts text to an array of color values.
 *
 * @param {string} text - The text to be encoded into colors.
 * @param {number} [pd=MC_encoding_size] - The padding size used in encoding.
 * @returns {ColorArray[]} An array consisting of the encoded color values.
 */
function MC_packToColors(text, pd = MC_encoding_size) {
  return MC_encode_text(MC_packText(text, pd))
}

/**
 * Decompresses and converts an array of color values back into text.
 *
 * @param {ColorArray[]} colors - The encoded color values to be decoded.
 * @param {number} [pd=MC_encoding_size] - The padding size used in decoding.
 * @returns {string} The original text obtained from the color values.
 */
function MC_unpackFromColors(colors, pd = MC_encoding_size) {
  return MC_unpackText(MC_decode_color_arr(colors), pd)
}

// ---
// @@ Core

/**
 * Handle the generation process for the meme canvas.
 * @param {HTMLCanvasElement} canvas - The canvas element to draw on.
 * @param {CanvasRenderingContext2D} ctx - The rendering context of the canvas.
 */
function MC_handle_generate(canvas, ctx) {
  let i = -1, zi = 0;

  let colors = MC_packToColors(renderer.input.value)

  let hf = MC_packToColors(`hf: ${MC_header_encoding_size}`, 2)
  let hcolors = MC_tl_corner(colors).map(v => MC_packToColors(v, MC_header_encoding_size))

  function processColors(colors, startIndex) {
    colors.forEach((line, lineIndex) => processLine(line, startIndex + lineIndex));
  }

  function processLine(line, lineIndex = 0) {
    line.forEach((color, colorIndex) => {
      MC_flat_set_pixel(ctx, (canvas.width * lineIndex) + colorIndex, color);
    });
    zi += canvas.width
  }

  // @@ Header
  processLine(hf, 0)
  zi += canvas.width

  processColors(hcolors, 2)
  zi += canvas.width

  // @@ Body
  // zi += canvas.width
  while (++i < colors.length) {
    let color = colors[i]
    MC_flat_set_pixel(ctx, i + zi, color)
  }
}

// ---
// @@ Start

{
  var renderer = MC_display_Image_Renderer()
  MC_generate()
}