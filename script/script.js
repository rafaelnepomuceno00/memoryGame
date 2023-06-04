const MODALGAMEOVER = document.querySelector('#modalGameOver');
const CONTAINER = document.querySelector('.container');
let freezeClick = false;
let matches = 0;
let flippedCards = [];

createMenu();

function createMenu() {
  MODALGAMEOVER.style.visibility = 'hidden';

  let options = ['animals', 'colors', 'numbers'];   

  CONTAINER.innerHTML = '';

  let menu = document.createElement('div');
  menu.setAttribute('class', 'menu');

  CONTAINER.appendChild(menu);

  let title = document.createElement('h1');
  title.setAttribute('class', 'titleMenu');
  title.textContent = 'MEMORY GAME';

  menu.append(title);

  options.map((option) => {
    let button = document.createElement('button');
    button.setAttribute('class', `button ${option}`);
    button.addEventListener('click', () => {
      startGame(option);
    });

    button.textContent = option;

    menu.append(button);
  });
}

function startGame(stage) {
  let images = [];
  matches = 0;
  configModal(stage);
  images = createRandomImagesArray(stage);
  MODALGAMEOVER.style.visibility = 'hidden';

  CONTAINER.innerHTML = '';
  for (var i = 0; i < 12; i++) {
    let card = document.createElement('div');
    card.setAttribute('class', 'card');

    let card_front = document.createElement('div');
    card_front.innerText= '?'
    card_front.setAttribute('class', `face front  front_${stage}`);

    let card_back = document.createElement('div');
    card_back.setAttribute('class', 'face back');
    card_back.style.background = 'url("' + images[i].src + '")';
    card_back.style.backgroundRepeat = 'no-repeat';
    card_back.style.backgroundSize = 'cover';
    card_back.style.backgroundPosition = 'center';
    card_back.setAttribute('datasheet', images[i].id);

    card.addEventListener('click', flipCard);
    card.appendChild(card_front);
    card.appendChild(card_back);
    CONTAINER.appendChild(card);
  }
}

function createRandomImagesArray(stage) {
  let images = [];
  let randomArray = [];

  for (let i = 0; i < 12; i++) {
    let img = {
      src: `../assets/${stage}/` + i + '.jpeg',
      id: i % 6,
    };
    images.push(img);
  }
  while (randomArray.length !== images.length) {
    let i = Math.floor(Math.random() * images.length);
    if (randomArray.indexOf(images[i]) < 0) {
      randomArray.push(images[i]);
    }
  }

  return randomArray;
}

function flipCard(event) {
  if (freezeClick) {
    event.stopPropagation();
    event.preventDefault();
  } else {
    if (flippedCards.length < 2) {
      let faces = this.getElementsByClassName('face');

      if (faces[0].classList.length > 3) {
        return;
      }

      faces[0].classList.toggle('flipped');
      faces[1].classList.toggle('flipped');

      flippedCards.push(this);

      if (flippedCards.length === 2) {
        if (
          flippedCards[0].childNodes[1].attributes.datasheet.value ===
          flippedCards[1].childNodes[1].attributes.datasheet.value
        ) {
          flippedCards[0].childNodes[0].classList.toggle('match');
          flippedCards[0].childNodes[1].classList.toggle('match');
          flippedCards[1].childNodes[0].classList.toggle('match');
          flippedCards[1].childNodes[1].classList.toggle('match');

          matches++;

          flippedCards = [];

          if (matches === 6) {
            setTimeout(() => {
              gameOver();
            }, 1500);
          }
        } else {
          flippedCards[0].childNodes[0].classList.toggle('unmatch');
          flippedCards[0].childNodes[1].classList.toggle('unmatch');
          flippedCards[1].childNodes[0].classList.toggle('unmatch');
          flippedCards[1].childNodes[1].classList.toggle('unmatch');
          freezeClick = true;
          setTimeout(() => {
            flippedCards[0].childNodes[0].classList.toggle('unmatch');
            flippedCards[0].childNodes[1].classList.toggle('unmatch');
            flippedCards[1].childNodes[0].classList.toggle('unmatch');
            flippedCards[1].childNodes[1].classList.toggle('unmatch');
            freezeClick = false;
            flipCard();
          }, 800);
        }
      }
    } else {
      flippedCards[0].childNodes[0].classList.toggle('flipped');
      flippedCards[0].childNodes[1].classList.toggle('flipped');
      flippedCards[1].childNodes[0].classList.toggle('flipped');
      flippedCards[1].childNodes[1].classList.toggle('flipped');  
      flippedCards = [];
    } 
  }
}

function configModal(stage) {
  let playAgainBtn = document.querySelector('#btnPlayAgain');
  playAgainBtn.classList = `modalButton play_again_${stage}`
  playAgainBtn.addEventListener(
    'click',
    () => {
      startGame(stage);
    },
    false,
  );
  let menuBtn = document.querySelector('#btnMenu');
  menuBtn.classList = `modalButton button_${stage}_menu`
  menuBtn.addEventListener(
    'click',
    () => {
      createMenu();
    },
    false,
  );
}

function gameOver() {
  let audio = new Audio('../assets/victory.mp3');
  audio.play();
  MODALGAMEOVER.style.visibility = 'visible';
}
