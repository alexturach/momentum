import playList from './playList.js';
import greetingTranslation from './translate.js';
const time = document.querySelector('.time');
const dateBox = document.querySelector('.date');
const greetingContainer = document.querySelector('.greeting-container');
const greetingBox = document.querySelector('.greeting');
const nameInput = document.querySelector('.name');
const body = document.querySelector('body');
const weather = document.querySelector('.weather');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const weatherError = document.querySelector('.weather-error');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const cityInput = document.querySelector('.city');
let randomNumber;
const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');
const audio = new Audio();
const player = document.querySelector('.player');
const play = document.querySelector('.play');
const playPervBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
let isPlay = false;
let playNum = 0;
const playListContainer = document.querySelector('.play-list');
const optionBtn = document.querySelector('.optionBtn');
const optionBox = document.querySelector('.optionBox');
const checkTime = document.getElementById('checkTime');
const checkWeather = document.getElementById('checkWeather');
const checkPlayer = document.getElementById('checkPlayer');
const checkGreeting = document.getElementById('checkGreeting');
const checkQuote = document.getElementById('checkQuote');
const checkImgApi = document.getElementById('checkImgApi');
const html = document.querySelector('html');
let lang = html.lang;
const langBtn = document.querySelector('.switchLang');

function showTime() {
  const date = new Date();
  const currentTime = date.toLocaleTimeString();
  time.textContent = currentTime;
  const options = {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  };
  const currentDate = date.toLocaleDateString(lang, options);
  dateBox.textContent = currentDate;
  showGreeting();
  setTimeout(showTime, 1000);
}
showTime();

function getTimeOfDay() {
  const date = new Date();
  const hours = date.getHours();
  if (hours < 6) {
    return greetingTranslation[lang][3];
  } 
  else 
  if (hours > 6 && hours < 12) {
    return greetingTranslation[lang][0];
  } else if (hours < 18) {
    return greetingTranslation[lang][1];
  } else {
    return greetingTranslation[lang][2];
  }
}


function getTimeOfDayForBg() {
  const date = new Date();
  const hours = date.getHours();
  if (hours < 6) {
    return 'night';
  } else if (hours < 12) {
    return 'morning';
  } else if (hours < 18) {
    return 'afternoon';
  } else {
    return 'evening';
  }
}

function showGreeting() {
  const timeOfDay = getTimeOfDay();
  greetingBox.textContent = timeOfDay;
}

function setLocalStorage() {
  localStorage.setItem('name', nameInput.value);
  localStorage.setItem('city', cityInput.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {    nameInput.value = localStorage.getItem('name');
  
    cityInput.value = localStorage.getItem('city')
  
}

window.addEventListener('load', getLocalStorage)

function getRandomNum() {
  randomNumber = Math.floor(Math.random() * (21 - 1)) + 1;
  if (randomNumber < 10) {
    randomNumber = String(randomNumber).padStart(2, '0');
  } else {
    randomNumber = randomNumber;
  }
}
getRandomNum()

function setBg() {
  const timeOfDay = getTimeOfDayForBg();
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/alexturach/stage1-tasks-assets/main/images/${timeOfDay}/${randomNumber}.jpg`;
  img.onload = () => {
    body.style.backgroundImage = `url('https://raw.githubusercontent.com/alexturach/stage1-tasks-assets/main/images/${timeOfDay}/${randomNumber}.jpg')`;
  };
}
setBg()

slideNext.onclick = function () {
  if (!checkImgApi.checked) {
    if (randomNumber < 20) {
      randomNumber++;
      if (randomNumber < 10) {
        randomNumber = String(randomNumber).padStart(2, '0');
      }
    } else {
      randomNumber = '01';
    }
    setBg()
  } else {
    getLinkToImage()
  }
}

slidePrev.onclick = function () {
  if (!checkImgApi.checked) {
    if (randomNumber > 1) {
      randomNumber--;
      if (randomNumber < 10) {
        randomNumber = String(randomNumber).padStart(2, '0');
      }
    } else {
      randomNumber = 20;
    }
    setBg()
  }
  else {
    getLinkToImage()
  }

}

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&lang=${lang}&appid=3d0fcc33274a06e54067d8762f395dc6&units=metric`;
  const res = await fetch(url);
  const data = await res.json();
  weatherError.textContent = '';
  if (data.cod === '404' || cityInput.value === '') {
    weatherIcon.className = '';
    if (lang === 'en') {
      weatherError.textContent = `Error! city not found for ${cityInput.value}`
    } else {
      weatherError.textContent = 'Ошибка! Такой город не найден';
    }
    temperature.textContent = '';
    weatherDescription.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
  } else {
    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    if (lang === 'en') {
      wind.textContent = `Wind speed: ${Math.round(data.wind.speed)} m/s`;
      humidity.textContent = `Humidity: ${data.main.humidity}%`;
    } else {
      wind.textContent = `Скорость ветра: ${Math.round(data.wind.speed)} м/с`;
      humidity.textContent = `Влажность: ${data.main.humidity}%`;
    }
  }
}
getWeather()
cityInput.addEventListener('change', getWeather);

async function getQuotes() {
    const quotes = 'quotes.json';
    const res = await fetch(quotes);
    const data = await res.json();
    let randNum = Math.floor(Math.random() * (1000 - 1)) + 1;
    quote.textContent = data[randNum].text;
    author.textContent = data[randNum].author;
  
}
getQuotes();



changeQuote.onclick = getQuotes;

play.onclick = playAudio;

function playAudio() {
  audio.src = playList[playNum].src;
  play.classList.toggle('pause');
  if (!isPlay) {
    audio.currentTime = 0;
    audio.play();
    isPlay = true;
  } else {
    audio.pause();
    isPlay = false;
  }
};

playNextBtn.onclick = playNext;

function playNext() {
  play.classList.remove('pause');
  isPlay = false;
  if (playNum < playList.length - 1) {
    playNum++;
  } else {
    playNum = 0;
  }
  playAudio();
}
playPervBtn.onclick = playPrev;

function playPrev() {
  play.classList.remove('pause');
  isPlay = false;
  if (playNum > 1) {
    playNum--;
  } else {
    playNum = playList.length - 1;
  }
  playAudio();
}

function createLi() {

  for (let i = 0; i < playList.length; i++) {
    const li = document.createElement('li');
    li.classList.add('play-item');
    playListContainer.append(li);
    const liItem = document.querySelector('.play-item');
    li.textContent = playList[i].title;
  }

}
createLi()

optionBtn.onclick = displayOption;

function displayOption() {
  optionBox.classList.toggle('showOptions')
}

checkTime.onclick = hideTime;

function hideTime() {
  if (checkTime.checked) {
    time.classList.remove('hidden');
    dateBox.classList.remove('hidden');
  } else {
    time.classList.add('hidden');
    dateBox.classList.add('hidden');
  }
}

checkWeather.onclick = hideWeather;

function hideWeather() {
  if (checkWeather.checked) {
    weather.classList.remove('hidden');
  } else {
    weather.classList.add('hidden');
  }
}

checkPlayer.onclick = hidePlayer;

function hidePlayer() {
  if (checkPlayer.checked) {
    player.classList.remove('hidden');
  } else {
    player.classList.add('hidden');
  }
}

checkGreeting.onclick = hideGreeting;

function hideGreeting() {
  if (checkGreeting.checked) {
    greetingContainer.classList.remove('hidden');
  } else {
    greetingContainer.classList.add('hidden');
  }
}

checkQuote.onclick = hideQuote;

function hideQuote() {
  if (checkQuote.checked) {
    changeQuote.classList.remove('hidden');
    quote.classList.remove('hidden');
    author.classList.remove('hidden');
  } else {
    changeQuote.classList.add('hidden');
    quote.classList.add('hidden');
    author.classList.add('hidden');
  }
}

checkImgApi.onclick = changeBg;

function changeBg() {
  if (checkImgApi.checked) {
    getLinkToImage();
  } else {
    setBg();
  }
}


langBtn.onclick = switchLang;

function switchLang() {
  if (html.lang === 'en') {
    html.lang = 'ru';
  } else {
    html.lang = 'en';
  }
  lang = html.lang;
  showGreeting();
  showTime();
  getWeather()
}

async function getLinkToImage() {
  const url = 'https://api.unsplash.com/photos/random?orientation=landscape&query=nature&client_id=8ZtKOgzgoRSIE_OwQtx5LIycjinanVYgZI23ZNYYtKE';
  const res = await fetch(url);
  const data = await res.json();
  
  body.style.backgroundImage = `url('${data.urls.regular}')`
}