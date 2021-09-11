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

function close(c0, c1, rr = 1, rg = rr, rb = rr) {
  return Math.abs(c0.r - c1.r) < rr &&
         Math.abs(c0.g - c1.g) < rg &&
         Math.abs(c0.b - c1.b) < rb;
}



let board_preview = document.getElementById('board_preview');
board_preview.width = board_preview.height = (window.innerHeight - 100) / 2;
board_preview.style = `position: fixed; right: 25px; top: 25px;`;
const board_ctx = board_preview.getContext('2d');

let menu_preview = document.getElementById('menu_preview');
menu_preview.height = (window.innerHeight - 100) / 2;
menu_preview.width = 400 / 542 * menu_preview.height;
menu_preview.style = `position: fixed; right: ${25 + menu_preview.width / 6}px; top: ${40 + board_preview.height}px;`;
const menu_ctx = menu_preview.getContext('2d');


let board_img = new Image();
board_img.src = 'https://i.postimg.cc/G2hFQM7z/board-1.png';
board_img.crossOrigin = 'Anonymous';

let menu_img = new Image();
menu_img.src = 'https://i.postimg.cc/4N3dwDQr/menu.png';
menu_img.crossOrigin = 'Anonymous';

board_img.width = (window.innerHeight - 100) / 2;
board_img.height = (window.innerHeight - 100) / 2;
menu_img.width = (window.innerHeight - 100) / 2;
menu_img.height = 400 / 542 * (window.innerHeight - 100) / 2;


let board_data, board_pix, menu_data, menu_pix;

setTimeout(_ => {
  

  board_ctx.drawImage(board_img, 0, 0, (window.innerHeight - 100) / 2, (window.innerHeight - 100) / 2);
  menu_ctx.drawImage(menu_img, 0, 0, 400 / 542 * (window.innerHeight - 100) / 2, (window.innerHeight - 100) / 2);

  board_data = board_ctx.getImageData(0, 0, board_preview.width, board_preview.height);
  board_pix = board_data.data;
  menu_data = menu_ctx.getImageData(0, 0, menu_preview.width, menu_preview.height);
  menu_pix = menu_data.data;


  
}, 300);

function cool() {
  board_ctx.fillStyle = 'black';
  board_ctx.fillRect(0, 0, (window.innerHeight - 100) / 2, (window.innerHeight - 100) / 2);
  menu_ctx.fillStyle = 'black';
  menu_ctx.fillRect(0, 0, 400 / 542 * (window.innerHeight - 100) / 2, (window.innerHeight - 100) / 2);

  board_ctx.drawImage(board_img, 0, 0, (window.innerHeight - 100) / 2, (window.innerHeight - 100) / 2);
  menu_ctx.drawImage(menu_img, 0, 0, 400 / 542 * (window.innerHeight - 100) / 2, (window.innerHeight - 100) / 2);
  board_data = board_ctx.getImageData(0, 0, board_preview.width, board_preview.height);
  board_pix = board_data.data;
  menu_data = menu_ctx.getImageData(0, 0, menu_preview.width, menu_preview.height);
  menu_pix = menu_data.data;

  const score_bar     = hex_to_rgb(document.getElementById('score_bar').value     || '#4A752C');
  const border        = hex_to_rgb(document.getElementById('border').value        || '#578A34');
  const walls         = hex_to_rgb(document.getElementById('walls').value         || '#578A34');
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

  let light_goal = rgb_to_hsv(light_squares.r, light_squares.g, light_squares.b);
  light_goal = hsv_to_rgb(
    light_goal.h,
    Math.min(light_goal.s + .03, 1),
    Math.min(light_goal.v + .07, 1)
  );

  let dark_goal = rgb_to_hsv(dark_squares.r, dark_squares.g, dark_squares.b);
  dark_goal = hsv_to_rgb(
    dark_goal.h,
    Math.min(dark_goal.s + .03, 1),
    Math.max(dark_goal.v - .08, 0)
  );


  for(let y = 0; y < board_preview.height; y++) {
    for(let x = 0; x < board_preview.width; x++) {
      const i = 4 * (x + y * board_preview.width);
      const c = {
        r: board_pix[0 + i],
        g: board_pix[1 + i],
        b: board_pix[2 + i],
      };

      if(close(c, { r: 162, g: 209, b: 73, }, 5)) {
        board_pix[0 + i] = dark_squares.r;
        board_pix[1 + i] = dark_squares.g;
        board_pix[2 + i] = dark_squares.b;
      } else if(close(c, { r: 170, g: 215, b: 81, }, 5)) {
        board_pix[0 + i] = light_squares.r;
        board_pix[1 + i] = light_squares.g;
        board_pix[2 + i] = light_squares.b;
      } else if(close(c, { r: 74, g: 117, b: 44, }, 5)) {
        board_pix[0 + i] = score_bar.r;
        board_pix[1 + i] = score_bar.g;
        board_pix[2 + i] = score_bar.b;
      } else if(close(c, { r: 148, g: 189, b: 70, }, 5)) {
        board_pix[0 + i] = shadows.r;
        board_pix[1 + i] = shadows.g;
        board_pix[2 + i] = shadows.b;
      } else if(close(c, { r: 87, g: 138, b: 52, }, 5)) {
        board_pix[0 + i] = border.r;
        board_pix[1 + i] = border.g;
        board_pix[2 + i] = border.b;
      }// else if(close(c, { r: 135, g: 182, b: 117, }, 5)) {
        // board_pix[0 + i] = 76;
        // board_pix[1 + i] = 122;
        // board_pix[2 + i] = 218;
      /*}*/ else if(close(c, { r: 0, g: 127, b: 14, }, 5)) {
        board_pix[0 + i] = walls.r;
        board_pix[1 + i] = walls.g;
        board_pix[2 + i] = walls.b;
      } else if(close(c, { r: 179, g: 226, b: 85, }, 5)) {
        board_pix[0 + i] = light_goal.r;
        board_pix[1 + i] = light_goal.g;
        board_pix[2 + i] = light_goal.b;
      } else if(close(c, { r: 152, g: 196, b: 68, }, 5)) {
        board_pix[0 + i] = dark_goal.r;
        board_pix[1 + i] = dark_goal.g;
        board_pix[2 + i] = dark_goal.b;
      }
    }
  }
  for(let y = 0; y < menu_preview.height; y++) {
    for(let x = 0; x < menu_preview.width; x++) {
      const i = 4 * (x + y * menu_preview.width);
      const c = {
        r: menu_pix[0 + i],
        g: menu_pix[1 + i],
        b: menu_pix[2 + i],
      };

      if(close(c, { r: 58, g: 145, b: 187, }, 5, 1, 1)) {
        menu_pix[0 + i] = dark_sky.r;
        menu_pix[1 + i] = dark_sky.g;
        menu_pix[2 + i] = dark_sky.b;
      } else if(close(c, { r: 77, g: 193, b: 249, }, 5)) {
        menu_pix[0 + i] = sky.r;
        menu_pix[1 + i] = sky.g;
        menu_pix[2 + i] = sky.b;
      } else if(close(c, { r: 0, g: 148, b: 255, }, 50, 80, 50)) {
        menu_pix[0 + i] = separators.r;
        menu_pix[1 + i] = separators.g;
        menu_pix[2 + i] = separators.b;
      } else if(close(c, { r: 17, g: 85, b: 204, }, 5)) {
        menu_pix[0 + i] = buttons.r;
        menu_pix[1 + i] = buttons.g;
        menu_pix[2 + i] = buttons.b;
      }

      
    }
  }

  board_ctx.putImageData(board_data, 0, 0);
  menu_ctx.putImageData(menu_data, 0, 0);

}





document.getElementById('score_bar').oninput =
document.getElementById('border').oninput = 
document.getElementById('shadows').oninput =
document.getElementById('light_squares').oninput =
document.getElementById('dark_squares').oninput =
document.getElementById('sky').oninput =
document.getElementById('separators').oninput =
document.getElementById('buttons').oninput =
document.getElementById('walls').oninput =
cool;

// document.getElementById('preview_button').onclick = cool;

setTimeout(cool, 500);

document.getElementById('save').onclick = function() {

  const title = document.getElementById('title').value || 'scheme';
  const score_bar = document.getElementById('score_bar').value;
  const border = document.getElementById('border').value;
  const walls = document.getElementById('walls').value;
  const background = document.getElementById('background').value;
  const shadows = document.getElementById('shadows').value;
  const light_squares = document.getElementById('light_squares').value;
  const dark_squares = document.getElementById('dark_squares').value;
  const sky = document.getElementById('sky').value;
  const separators = document.getElementById('separators').value;
  const buttons = document.getElementById('buttons').value;
  const burger = document.getElementById('burger').checked;
  const hotdog = document.getElementById('hotdog').checked;
  const cactus = document.getElementById('cactus').checked;
  const egg = document.getElementById('egg').checked;
  const lime = document.getElementById('lime').checked;
  const pepper = document.getElementById('pepper').checked;



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
    <DT><A HREF="javascript: req = new XMLHttpRequest(); req.open('GET', 'https://raw.githubusercontent.com/DarkSnakeGang/GoogleSnakeDarkMode/main/custom_color_scheme.js'); req.onload = function() { eval(this.responseText + \`snake.scheme({ scoreBar: '${score_bar || '#4A752C'}', borders: '${border || '#578A34'}', walls: '${walls || border || '#578A34'}', background: '${(background === '#4A752C' ? score_bar : background) || score_bar || '#4A752C'}', shadows: '${shadows || '#94BD46'}', lightSquares: '${light_squares || '#AAD751'}', darkSquares: '${dark_squares || '#A2D149'}', sky: '${sky || '#4DC1F9'}', separators: '${separators || '#87CEFA'}', buttons: '${buttons || '#1155CC'}', burger: ${burger}, hotdog: ${hotdog}, cactus: ${cactus}, egg: ${egg}, lime: ${lime}, red_pepper: ${pepper}, });\`); }; req.send();" ADD_DATE="1618965670">${title}</A>
    </DL><p>    `
  );
};


[...document.getElementsByClassName('baaaa')].forEach(e => e.addEventListener('auxclick', function(evt) {
  if(evt.button === 1)
    e.onclick();
}));