const images = {
  mode: [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
    new Image(),
  ],
  count: [
    new Image(),
    new Image(),
    new Image(),
  ],
  speed: [
    new Image(),
    new Image(),
  ],
  size: [
    new Image(),
    new Image(),
  ],
  amount: [
    new Image(),
    new Image(),
    new Image(),
    new Image(),
  ],
};




images.mode[0].src  = 'https://www.google.com/logos/fnbx/snake_arcade/v13/trophy_00.png';
images.mode[1].src  = 'https://www.google.com/logos/fnbx/snake_arcade/v13/trophy_01.png';
images.mode[2].src  = 'https://www.google.com/logos/fnbx/snake_arcade/v13/trophy_02.png';
images.mode[3].src  = 'https://www.google.com/logos/fnbx/snake_arcade/v13/trophy_03.png';
images.mode[4].src  = 'https://www.google.com/logos/fnbx/snake_arcade/v13/trophy_04.png';
images.mode[5].src  = 'https://www.google.com/logos/fnbx/snake_arcade/v13/trophy_05.png';
images.mode[6].src  = 'https://www.google.com/logos/fnbx/snake_arcade/v13/trophy_06.png';
images.mode[7].src  = 'https://www.google.com/logos/fnbx/snake_arcade/v13/trophy_07.png';
images.mode[8].src  = 'https://www.google.com/logos/fnbx/snake_arcade/v13/trophy_08.png';
images.mode[9].src  = 'https://www.google.com/logos/fnbx/snake_arcade/v13/trophy_09.png';
images.mode[10].src = 'https://www.google.com/logos/fnbx/snake_arcade/v13/trophy_10.png';
images.mode[11].src = 'https://www.google.com/logos/fnbx/snake_arcade/v13/trophy_11.png';

images.count[0].src = 'https://www.google.com/logos/fnbx/snake_arcade/v3/count_00.png';
images.count[1].src = 'https://www.google.com/logos/fnbx/snake_arcade/v3/count_01.png';
images.count[2].src = 'https://www.google.com/logos/fnbx/snake_arcade/v3/count_02.png';

images.speed[0].src = 'https://www.google.com/logos/fnbx/snake_arcade/v3/speed_00.png';
images.speed[1].src = 'https://www.google.com/logos/fnbx/snake_arcade/v3/speed_01.png';

images.size[0].src = 'https://www.google.com/logos/fnbx/snake_arcade/v4/size_00.png';
images.size[1].src = 'https://www.google.com/logos/fnbx/snake_arcade/v4/size_01.png';

images.amount[0].src = '25.png';
images.amount[1].src = '50.png';
images.amount[2].src = '100.png';
images.amount[3].src = 'all.png';


document.getElementById('swag').onclick = function() {
  const stuff = acidreflux();
  
  const modei  = images.mode [ stuff.mode  ]; modei.width  = modei.height  = 64;
  const counti = images.count[ stuff.count ]; counti.width = counti.height = 64;
  const speedi = images.speed[ stuff.speed ]; speedi.width = speedi.height = 64;
  const sizei  = images.size [ stuff.size  ]; sizei.width  = sizei.height  = 64;
  
  

  let o = document.getElementById('output');
  o.innerHTML = '';

  o.appendChild(modei);
  o.appendChild(counti);
  o.appendChild(speedi);
  o.appendChild(sizei);

  if(stuff.amount !== null) {
    const amounti = images.amount[stuff.amount];
    amounti.width = amounti.height = 64;
    o.appendChild(amounti);
    document.getElementById('attempts').innerHTML = '';
  } else {
    let attempts = 1;
    if(stuff.size === 1)
      attempts = 2;
    if(stuff.speed === 1)
      attempts++;
    document.getElementById('attempts').innerHTML = `${attempts} attempt${attempts > 1 ? 's' : ''}`;
  }

  
  
};


function acidreflux() {
  let mode   = ~~(Math.random() * 12);
  let count  = ~~(Math.random() * 3);
  let speed  = ~~(Math.random() * 2);
  let size   = ~~(Math.random() * 2);
  let amount = null;


  if(count === 0 && size === 0)
    return acidreflux();

  if(!(mode === 1 || mode === 2 || mode === 8 || mode === 9 || mode === 10)) {
    if(size === 0) {
      amount = ~~(Math.random() * 4);
    } else {
      amount = ~~(Math.random() * 3);
      if(amount === 2)
        amount = 3;
    }
  }

  return {
    mode:   mode,
    count:  count,
    speed:  speed,
    size:   size,
    amount: amount,
  };

}
