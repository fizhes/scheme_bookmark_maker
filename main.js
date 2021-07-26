function create_bookmark(name, text) {
  let a = document.createElement('a');
  a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
  a.download = name;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function hex_to_rgb(hex) {
  hex = hex.replace('#', '');
  return {
    r: parseInt(hex.substring(0, 2), 16),
    g: parseInt(hex.substring(2, 4), 16),
    b: parseInt(hex.substring(4, 6), 16),
  };
}
function rgb_to_hsv(r, g, b) {
  let R = r / 255, G = g / 255, B = b / 255;
  let xmax = Math.max(R, G, B);
  let xmin = Math.min(R, G, B);
  let C = xmax - xmin;
  let h, s, v;
  v = xmax;
  h = C == 0 ? 0 : v == R ? 60 * (G-B)/C : v == G ? 60 * (2+(B-R)/C) : v == B ? 60 * (4+(R-G)/C) : 0;
  s = v == 0 ? 0 : C/v;
  return { h: h < 0 ? h + 360 : h, s: s, v: v, };
}
function hsv_to_rgb(h, s, v) {
  let C = v * s;
  let H = h / 60;
  let X = C * (1 - Math.abs((H % 2) - 1));
  
  let [ R, G, B, ] = 0 <= H && H <= 1 ? [ C, X, 0, ] : H <= 2 ? [ X, C, 0, ] : H <= 3 ? [ 0, C, X, ] : H <= 4 ? [ 0, X, C, ] : H <= 5 ? [ X, 0, C, ] : H <= 6 ? [ C, 0, X, ] : [ 0, 0, 0, ];

  let m = v - C;
  let r = R + m, g = G + m, b = B + m;

  return { r: r * 255, g: g * 255, b: b * 255, };
}

function close(c0, c1, rr = 8, rg = rr, rb = rr) {
  return Math.abs(c0.r - c1.r) < rr &&
         Math.abs(c0.g - c1.g) < rg &&
         Math.abs(c0.b - c1.b) < rb;
}

let board_preview = document.getElementById('board_preview');
const board_ctx = board_preview.getContext('2d');
let menu_preview = document.getElementById('menu_preview');
const menu_ctx = menu_preview.getContext('2d');

let board_img = new Image();
board_img.src = 'board.png';
board_img.crossOrigin = 'Anonymous';
let menu_img = new Image();
menu_img.src = 'menu.png';
menu_img.crossOrigin = 'Anonymous';

let board_data, board_pix, menu_data, menu_pix;

setTimeout(_ => {

  board_ctx.drawImage(board_img, 0, 0);
  menu_ctx.drawImage(menu_img, 0, 0);

  board_data = board_ctx.getImageData(0, 0, 400, 400);
  board_pix = board_data.data;
  menu_data = menu_ctx.getImageData(0, 0, 400, 542);
  menu_pix = menu_data.data;


  
}, 250);

function cool() {
  board_ctx.drawImage(board_img, 0, 0);
  menu_ctx.drawImage(menu_img, 0, 0);
  board_data = board_ctx.getImageData(0, 0, 400, 400);
  board_pix = board_data.data;
  menu_data = menu_ctx.getImageData(0, 0, 400, 542);
  menu_pix = menu_data.data;

  const score_bar     = hex_to_rgb(document.getElementById('score_bar').value     || '#4A752C');
  const border        = hex_to_rgb(document.getElementById('border').value        || '#578A34');
  const shadows       = hex_to_rgb(document.getElementById('shadows').value       || '#94BD46');
  const light_squares = hex_to_rgb(document.getElementById('light_squares').value || '#AAD751');
  const dark_squares  = hex_to_rgb(document.getElementById('dark_squares').value  || '#A2D149');
  const sky           = hex_to_rgb(document.getElementById('sky').value           || '#4DC1F9');
  const separators    = hex_to_rgb(document.getElementById('separators').value    || '#87CEFA')
  const buttons       = hex_to_rgb(document.getElementById('buttons').value       || '#1155CC');

  let dark_sky = rgb_to_hsv(sky.r, sky.g, sky.b);
  dark_sky = hsv_to_rgb(
    dark_sky.h,
    Math.max(dark_sky.s - .01, 0),
    Math.max(dark_sky.v - .24, 0)
  );


  for(let y = 0; y < 400; y++) {
    for(let x = 0; x < 400; x++) {
      const i = 4 * (x + y * 400);
      const c = {
        r: board_pix[0 + i],
        g: board_pix[1 + i],
        b: board_pix[2 + i],
      };

      if(close(c, { r: 162, g: 209, b: 73, })) {
        board_pix[0 + i] = dark_squares.r;
        board_pix[1 + i] = dark_squares.g;
        board_pix[2 + i] = dark_squares.b;
      } else if(close(c, { r: 170, g: 215, b: 81, })) {
        board_pix[0 + i] = light_squares.r;
        board_pix[1 + i] = light_squares.g;
        board_pix[2 + i] = light_squares.b;
      } else if(close(c, { r: 74, g: 117, b: 44, })) {
        board_pix[0 + i] = score_bar.r;
        board_pix[1 + i] = score_bar.g;
        board_pix[2 + i] = score_bar.b;
      } else if(close(c, { r: 148, g: 189, b: 70, }, 25)) {
        board_pix[0 + i] = shadows.r;
        board_pix[1 + i] = shadows.g;
        board_pix[2 + i] = shadows.b;
      } else if(close(c, { r: 87, g: 138, b: 52, }, 30)) {
        board_pix[0 + i] = border.r;
        board_pix[1 + i] = border.g;
        board_pix[2 + i] = border.b;
      } else if(close(c, { r: 135, g: 182, b: 117, }, 25)) {
        board_pix[0 + i] = 76;
        board_pix[1 + i] = 122;
        board_pix[2 + i] = 218;
      }
    }
  }
  for(let y = 0; y < 542; y++) {
    for(let x = 0; x < 400; x++) {
      const i = 4 * (x + y * 400);
      const c = {
        r: menu_pix[0 + i],
        g: menu_pix[1 + i],
        b: menu_pix[2 + i],
      };

      if(close(c, { r: 58, g: 145, b: 187, }, 20, 40, 55)) {
        menu_pix[0 + i] = dark_sky.r;
        menu_pix[1 + i] = dark_sky.g;
        menu_pix[2 + i] = dark_sky.b;
      } else if(close(c, { r: 77, g: 193, b: 249, })) {
        menu_pix[0 + i] = sky.r;
        menu_pix[1 + i] = sky.g;
        menu_pix[2 + i] = sky.b;
      } else if(close(c, { r: 178, g: 0, b: 255, }, 20, 60, 8)) {
        menu_pix[0 + i] = separators.r;
        menu_pix[1 + i] = separators.g;
        menu_pix[2 + i] = separators.b;
      } else if(close(c, { r: 17, g: 85, b: 204, })) {
        menu_pix[0 + i] = buttons.r;
        menu_pix[1 + i] = buttons.g;
        menu_pix[2 + i] = buttons.b;
      }

      
    }
  }

  board_ctx.putImageData(board_data, 0, 0);
  menu_ctx.putImageData(menu_data, 0, 0);
}

document.getElementById('score_bar').onchange =
document.getElementById('border').onchange =
document.getElementById('shadows').onchange =
document.getElementById('light_squares').onchange =
document.getElementById('dark_squares').onchange =
document.getElementById('sky').onchange =
document.getElementById('separators').onchange =
document.getElementById('buttons').onchange =
cool;

document.getElementById('preview_button').onclick = cool;

setTimeout(cool, 500);

document.getElementById('save').onclick = function() {

  const title = document.getElementById('title').value;
  const score_bar = document.getElementById('score_bar').value;
  const border = document.getElementById('border').value;
  const walls = document.getElementById('walls').value;
  const background = document.getElementById('background').value;
  const shadows = document.getElementById('shadows').value;
  const light_squares = document.getElementById('light_squares').value;
  const dark_squares = document.getElementById('dark_squares').value;
  const light_goal = document.getElementById('light_goal').value;
  const dark_goal = document.getElementById('dark_goal').value;
  const key_block_marks = document.getElementById('key_block_marks').value;
  const sky = document.getElementById('sky').value;
  const separators = document.getElementById('separators').value;
  const buttons = document.getElementById('buttons').value;



  create_bookmark(
    `${title}.html`,
    `<!DOCTYPE NETSCAPE-Bookmark-file-1>
    <!-- This is an automatically generated file.
            It will be read and overwritten.
            DO NOT EDIT! -->
    <META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
    <TITLE>Bookmarks</TITLE>
    <H1>Bookmarks</H1>
    <DL><p>
    <DT><H3 ADD_DATE="1543535897" LAST_MODIFIED="1616635351" PERSONAL_TOOLBAR_FOLDER="true">Bookmarks bar</H3>
    <DT><A HREF="javascript: window.snake.scheme = function(settings = {}) {   if(settings.scoreBar === '')     settings.scoreBar = '#4A752C';   if(settings.borders === '')     settings.borders = '#578A34';   if(settings.walls === '')     settings.walls = settings.borders;   if(settings.shadows === '')     settings.shadows = '#94BD46';   if(settings.lightSquares === '')     settings.lightSquares = '#AAD751';   if(settings.darkSquares === '')     settings.darkSquares = '#A2D149';   if(settings.sky === '')     settings.sky = '#4DC1F9';   if(settings.separators === '')     settings.separators = '#87CEFA';   if(settings.buttons === '')     settings.buttons = '#1155CC';   if(settings.lightGoal === '') {     let f = settings.lightSquares;     f = f.replace('#', '');     let { h, s, v, } = RGBtoHSV(parseInt(f.substring(0, 2), 16), parseInt(f.substring(2, 4), 16), parseInt(f.substring(4, 6), 16));     s += 0.03;     v += 0.07;     s = s > 1 ? 1 : s;     v = v > 1 ? 1 : v;      let { r, g, b, } = HSVtoRGB(h, s, v);     settings.lightGoal = '#' + (~~r).toString(16) + (~~g).toString(16) + (~~b).toString(16);   }   if(settings.darkGoal === '') {     let f = settings.darkSquares;     f = f.replace('#', '');     let { h, s, v, } = RGBtoHSV(parseInt(f.substring(0, 2), 16), parseInt(f.substring(2, 4), 16), parseInt(f.substring(4, 6), 16));     s += 0.03;     v -= 0.08;     s = s > 1 ? 1 : s;     v = v > 1 ? 1 : v < 0 ? 0 : v;      let { r, g, b, } = HSVtoRGB(h, s, v);     settings.darkGoal = '#' + (~~r).toString(16) + (~~g).toString(16) + (~~b).toString(16);   }       document.body.bgColor = settings.background || settings.scoreBar;   document.getElementsByClassName('sEOCsb')[0].style.backgroundColor = settings.scoreBar;   let bacon = document.getElementsByClassName('T7SB3d');   for(let b of bacon)     b.style.background = settings.sky;   let pork = document.getElementsByClassName('e1XC2b');   for(let p of pork)     p.style.borderBottomColor = settings.separators;   let ham = document.getElementsByClassName('FL0z2d');   for(let h of ham)     h.style.background = settings.buttons;      const standard = document.createElement('canvas');   standard.width = 128;   standard.height = 128;   const mctx = standard.getContext('2d');   mctx.fillStyle = settings.borders;   roundRect(mctx, 16, 16, 95, 95, 5, true);   for(let i = 0; i < 3; i++) {     for(let j = 0; j < 3; j++){       if(i % 2 == 0 ^ j % 2 == 0)         mctx.fillStyle = settings.lightSquares;       else         mctx.fillStyle = settings.darkSquares;       mctx.fillRect(20 + i * 29, 20 + j * 29, 29, 29);     }   }         const url_m = standard.toDataURL();   document.getElementsByClassName('iLZj5e')[4].children[0].src = url_m;      const small = document.createElement('canvas');   small.width = 128;   small.height = 128;   const sctx = small.getContext('2d');   sctx.fillStyle = settings.borders;   roundRect(sctx, 26, 26, 75, 75, 5, true);    for(let i = 0; i < 2; i++) {     for(let j = 0; j < 2; j++) {       if(i % 2 == 0 ^ j % 2 == 0)         sctx.fillStyle = settings.lightSquares;       else         sctx.fillStyle = settings.darkSquares;        sctx.fillRect(30 + 34 * i, 30 + 34 * j, 34, 34);     }   }    const url_s = small.toDataURL();   document.getElementsByClassName('iLZj5e')[4].children[1].src = url_s;      const large = document.createElement('canvas');   large.width = 128;   large.height = 128;   const lctx = large.getContext('2d');   lctx.fillStyle = settings.borders;   roundRect(lctx, 6, 6, 115, 115, 5, true);    for(let i = 0; i < 4; i++)      for(let j = 0; j < 4; j++) {       if(i % 2 === 0 ^ j % 2 === 0)         lctx.fillStyle = settings.lightSquares;       else         lctx.fillStyle = settings.darkSquares;              lctx.fillRect(10 + 27 * i, 10 + 27 * j, 27, 27);     }      const url_l = large.toDataURL();   document.getElementsByClassName('iLZj5e')[4].children[2].src = url_l;     const wall_img = new Image();   wall_img.src = 'https://i.postimg.cc/XN8CGSPy/trophy-01.png';   wall_img.crossOrigin = 'Anonymous';   setTimeout(function() {     const wall_mode = document.createElement('canvas');     wall_mode.width = 128;     wall_mode.height = 128;     const wctx = wall_mode.getContext('2d');     wctx.drawImage(wall_img, 0, 0);      let wall_data = wctx.getImageData(0, 0, 128, 128);     let pix = wall_data.data;      let w_f = settings.walls;     w_f = w_f.replace('#', '');     let w_r = parseInt(w_f.substring(0, 2), 16);     let w_g = parseInt(w_f.substring(2, 4), 16);     let w_b = parseInt(w_f.substring(4, 6), 16);      let l_f = settings.lightSquares;     l_f = l_f.replace('#', '');     let l_r = parseInt(l_f.substring(0, 2), 16);     let l_g = parseInt(l_f.substring(2, 4), 16);     let l_b = parseInt(l_f.substring(4, 6), 16);      for(let y = 0; y < 128; y++)       for(let x = 0; x < 128; x++) {         let index = 4 * (x + y * 128);         let { h, s, v, } = RGBtoHSV(           pix[index],           pix[1 + index],           pix[2 + index]         );                     if(Math.abs(h - 95) < 2) {           pix[index] = w_r;           pix[1 + index] = w_g;           pix[2 + index] = w_b;         } else {           pix[index] = l_r;           pix[1 + index] = l_g;           pix[2 + index] = l_b;         }        }          wctx.putImageData(wall_data, 0, 0);      const url_w = wall_mode.toDataURL();     document.getElementsByClassName('e1XC2b')[1].children[0].children[1].src = url_w;     document.getElementsByClassName('vuOknd')[1].children[0].src = url_w;       let key_img = new Image();     key_img.src = 'https://i.postimg.cc/nzkFstB8/key-types-dark.png';     key_img.crossOrigin = 'Anonymous';     setTimeout(_ => {       const key_types = document.createElement('canvas');       key_types.width = 640;       key_types.height = 128;       const kctx = key_types.getContext('2d');       kctx.drawImage(key_img, 0, 0);        const kdata = kctx.getImageData(0, 0, 640, 128);       pix = kdata.data;        const wrgb = hex_to_rgb(settings.walls);       const whsv = RGBtoHSV(wrgb.r, wrgb.g, wrgb.b);       let new_hsv;       if(settings.keyBlockMarks) {         const kbm_rgb = hex_to_rgb(settings.keyBlockMarks);         new_hsv = RGBtoHSV(kbm_rgb.r, kbm_rgb.g, kbm_rgb.b);       } else if(whsv.s > .1)         new_hsv = {           h: Math.max(whsv.h - 5, 0),           s: Math.min(whsv.s + .24, 1),           v: Math.max(whsv.v - .16, 0),         };       else          new_hsv = {           h: Math.max(whsv.h - 5, 0),           s: Math.max(whsv.s - .24, 0),           v: Math.min(whsv.v + .16, 1),         };       const new_rgb = HSVtoRGB(new_hsv.h, new_hsv.s, new_hsv.v);        for(let y = 0; y < key_img.height; y++) {         for(let x = 0; x < key_img.width; x++) {           let index = 4 * (x + y * key_img.width);           let { h, s, v, } = RGBtoHSV(             pix[index],             pix[1 + index],             pix[2 + index]           );            if(Math.abs(h - 90) < 2) {             pix[index] = new_rgb.r;             pix[1 + index] = new_rgb.g;             pix[2 + index] = new_rgb.b;           }         }       }       kctx.putImageData(kdata, 0, 0);        const url_k = key_types.toDataURL();                 const scripts = document.body.getElementsByTagName('script');       for(let script of scripts) {         const req = new XMLHttpRequest();         req.open('GET', script.src);         req.onload = function() {           if(this.responseText.indexOf('#A2') !== -1)             processCode(this.responseText);         };         req.send();       }        function processCode(code) {         eval(\`var boxImage = new Image; boxImage.src = 'https://i.postimg.cc/GppCGFKQ/box.png';\`);         setTimeout(function() {                       const box = code.match(             /this\\.[a-zA-Z0-9_$]{1,8}=new [a-zA-Z0-9_$]{1,8}\\([^)}]*?box\\.png[^})]*?\\);/           )[0].replace('this.', '').replace(/=new[^]*/g, '');            const containee = code.match(             /[a-zA-Z0-9_$]{1,8}=function\\(a,b,c\\){this\\.[a-zA-Z0-9_$]{1,8}=new Image;[^}]*?this\\)}/           )[0].match(/this\\.[a-zA-Z0-9_$]{1,8}=document/)[0].replace('this.', '').replace('=document', '');            eval(             \`             var boxCanvas = document.createElement('canvas');             boxCanvas.width = 896;boxCanvas.height = 128;             var bctx = boxCanvas.getContext('2d');              bctx.drawImage(boxImage, 0, 0);                    bctx.fillStyle = '\${settings.lightGoal}';             bctx.fillRect(128, 0, 128, 128);              bctx.fillStyle = '\${settings.darkGoal}';             bctx.fillRect(149, 21, 85, 85);              bctx.fillStyle = '\${settings.lightGoal}';             bctx.fillRect(171, 43, 41, 41);              bctx.fillStyle = '\${settings.darkGoal}';             bctx.fillRect(256, 0, 128, 128);              bctx.fillStyle = '\${settings.lightGoal}';             bctx.fillRect(277, 21, 85, 85);              bctx.fillStyle = '\${settings.darkGoal}';             bctx.fillRect(299, 43, 41, 41);              bctx.fillStyle = '\${settings.lightGoal}';             bctx.fillRect(384, 0, 128, 128);              bctx.fillStyle = '\${settings.darkGoal}';             bctx.fillRect(405, 21, 85, 85);              bctx.fillStyle = '\${settings.lightGoal}';             bctx.fillRect(427, 43, 41, 41);              bctx.fillStyle = '\${settings.darkGoal}';             bctx.fillRect(512, 0, 128, 128);              bctx.fillStyle = '\${settings.lightGoal}';             bctx.fillRect(533, 21, 85, 85);              bctx.fillStyle = '\${settings.darkGoal}';             bctx.fillRect(555, 43, 41, 41);                \`           );            eval(             code.match(               /[a-zA-Z0-9_$]{1,8}=function\\(a\\){a\\.[a-zA-Z0-9_$]{1,8}\\.globalCompositeOperation[^}]*&quot;source-over&quot;}/             )[0].replace(               /#94BD46/g,               settings.shadows             )           );            const tkb = code.match(             /this\\.[a-zA-Z0-9_$]{1,8}=new [a-zA-Z0-9_$]{1,8}\\(&quot;snake_arcade\\/key_types_dark\\.png&quot;,[^)]*?\\)/           )[0].match(/this\\.[a-zA-Z0-9_$]{1,8}/)[0];            const oa = code.match(             /[a-zA-Z0-9_$]{1,8}=function\\(a\\){return a\\.[a-zA-Z0-9_$]{1,8}\\.canvas}/           )[0].match(/a\\.[a-zA-Z0-9_$]{1,8}\\.canvas/)[0].replace('a.', '').replace('.canvas', '');             eval(             \`_boorg = new Image;_boorg.src='\${url_k}';_boorg.crossOrigin='Anonymous';             boorg = { \${oa}: { canvas: _boorg, }, };\`           );           eval(             code.match(               /[a-zA-Z0-9_$]{1,8}\\.prototype\\.[a-zA-Z0-9_$]{1,8}=function\\(a\\){if\\(this\\.[a-zA-Z0-9_$]{1,8}&&!this\\.[a-zA-Z0-9_$]{1,8}\\){if\\(0<[^]*?#578A34[^]*?}}}/               )[0].replace(               '{',               \`{                 this\\.\${box}\\.\${containee} = { canvas: boxCanvas, };               \`             ).replace(               '#578A34',               settings.borders             ).replaceAll(               '#578A34',               settings.walls             ).replaceAll(               '#A2D149',               settings.lightSquares             ).replaceAll(               '#AAD751',               settings.darkSquares             ).replaceAll(               tkb,                'boorg'             )           );                                     eval(             code.match(               /[a-zA-Z0-9_$]{1,8}\\.prototype\\.[a-zA-Z0-9_$]{1,8}=function\\(a,b,c,d,e\\){this\\.[a-zA-Z0-9_$]{1,8}&&\\(this\\.[a-zA-Z0-9_$]{1,8}\\.translate[^}]*?y\\)\\)}/             )[0].replace(               '{',               \`{                 let canv = document.createElement('canvas');                 canv.width = 403;canv.height = 110;                        let ctx = canv.getContext('2d');                        for(let i = 0; i < 12; i++) {                   if(i % 2 === 0)                     ctx.fillStyle = '\${settings.darkSquares}';                   else                     ctx.fillStyle = '\${settings.lightSquares}';                                      ctx.fillRect(i * 34, 0, (i + 1) * 34, 34);                 }                        for(let i = 0; i < 12; i++) {                   if(i % 2 === 0)                     ctx.fillStyle = '\${settings.lightSquares}';                   else                     ctx.fillStyle = '\${settings.darkSquares}';                                      ctx.fillRect(i * 34, 34, (i + 1) * 34, 69);                 }                        for(let i = 0; i < 12; i++) {                   if(i % 2 === 0)                     ctx.fillStyle = '\${settings.darkSquares}';                   else                     ctx.fillStyle = '\${settings.lightSquares}';                                      ctx.fillRect(i * 34, 70, (i + 1) * 34, canv.height);                 }                                \`             ).replace(               'drawImage(',               \`               drawImage(Object.values(this).reduce(                 (s, el) => s || (typeof el === 'string' ? el.includes('end_empty') : false), false               ) ? canv :                \`             )           );         }, 250);                }     }, 250);   }, 250); };  window.snake.dark = function() {   return window.snake.scheme({   scoreBar:   '#262428',   walls:     '#101010',     borders:    '#2E2933',     shadows:   '#302C35',     lightSquares: '#47404F',     darkSquares:  '#423C49',     buttons:      '#131323',     sky:          '#191970',     separators:   '#201559',   }); }; window.snake.desert = function() {   return window.snake.scheme({     scoreBar:     '#B2A350',     background:   '#8C8340',     borders:      '#B2A350',     shadows:      '#A9993C',     lightSquares: '#E8D56A',     darkSquares:  '#C9B95C',   }); }; window.snake.pool = function() {   return window.snake.scheme({     scoreBar:     '#192544',     background:   '#214172',     borders:      '#152549',     shadows:      '#11529F',     lightSquares: '#359ECE',     darkSquares:  '#3172AF',   }); }; window.snake.light = function() {   return window.snake.scheme({     scoreBar:     '#555273',     background:   '#C0DDE8',     borders:      '#65799B',     shadows:      '#A6CCDE',     lightSquares: '#E2EFF1',     darkSquares:  '#B6D5E1',     buttons:      '#90B6D1',    }); }; window.snake.pink = function() {   return window.snake.scheme({     scoreBar:     '#DB3C8A',     background:   '#821655',     borders:      '#A03271',     shadows:      '#B64C9E',     lightSquares: '#EB92FB',     darkSquares:  '#C855BC',     buttons:      '#CA50CE',   }); }; window.snake.end = function() {   return window.snake.scheme({     scoreBar:     '#BBBBBB',     background:   '#000000',     borders:      '#888888',     shadows:      '#DDDDDD',     lightSquares: '#FFFFFF',     darkSquares:  '#FFFFFF',     sky:          '#eaeaea',     separators:   '#aeaeae',     buttons:      '#bdbdbd',   }); };     function RGBtoHSV(r, g, b) {   let R = r / 255, G = g / 255, B = b / 255;   let xmax = Math.max(R, G, B);   let xmin = Math.min(R, G, B);   let C = xmax - xmin;   let h, s, v;   v = xmax;   h = C == 0 ? 0 : v == R ? 60 * (G-B)/C : v == G ? 60 * (2+(B-R)/C) : v == B ? 60 * (4+(R-G)/C) : 0;   s = v == 0 ? 0 : C/v;   return { h: h < 0 ? h + 360 : h, s: s, v: v, }; }  function HSVtoRGB(h, s, v) {   let C = v * s;   let H = h / 60;   let X = C * (1 - Math.abs((H % 2) - 1));      let [ R, G, B, ] = 0 <= H && H <= 1 ? [ C, X, 0, ] : H <= 2 ? [ X, C, 0, ] : H <= 3 ? [ 0, C, X, ] : H <= 4 ? [ 0, X, C, ] : H <= 5 ? [ X, 0, C, ] : H <= 6 ? [ C, 0, X, ] : [ 0, 0, 0, ];    let m = v - C;   let r = R + m, g = G + m, b = B + m;    return { r: r * 255, g: g * 255, b: b * 255, }; }   function roundRect(ctx, x, y, width, height, radius, fill, stroke) {   if(typeof stroke === 'undefined')     stroke = false;   if(typeof radius === 'undefined')     radius = 5;   ctx.beginPath();   ctx.moveTo(x + radius, y);   ctx.lineTo(x + width - radius, y);   ctx.quadraticCurveTo(x + width, y, x + width, y + radius);   ctx.lineTo(x + width, y + height - radius);   ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);   ctx.lineTo(x + radius, y + height);   ctx.quadraticCurveTo(x, y + height, x, y + height - radius);   ctx.lineTo(x, y + radius);   ctx.quadraticCurveTo(x, y, x + radius, y);   ctx.closePath();   if(stroke)     ctx.stroke();   if(fill)     ctx.fill(); }  function hex_to_rgb(hex) {   hex = hex.replace('#', '');   return {     r: parseInt(hex.substring(0, 2), 16),     g: parseInt(hex.substring(2, 4), 16),     b: parseInt(hex.substring(4, 6), 16),   }; }window.snake.scheme({ scoreBar: '${score_bar}', background: '${background}', shadows: '${shadows}', lightSquares: '${light_squares}', darkSquares: '${dark_squares}', lightGoal: '${light_goal}', darkGoal: '${dark_goal}', keyBlockMarks: '${key_block_marks}', sky: '${sky}', separators: '${separators}', buttons: '${buttons}', borders: '${border}', walls: '${walls}', });" ADD_DATE="1618965670">${title}</A>
    </DL><p>    `
  );
};