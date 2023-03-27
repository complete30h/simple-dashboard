const moment = require("moment");
moment.locale('ru');

const time = document.querySelector(".time"),
  greeting = document.querySelector(".greeting"),
  name = document.querySelector(".name"),
  focus = document.querySelector(".focus"),
  city = document.querySelector(".city"),
  quote = document.querySelector(".quote"),
  quoteChange = document.querySelector(".quote-change"),
  bgChange = document.querySelector(".bg-change"),
  openModal = document.querySelector(".bg-view");

const weatherAPI = "94dc1074110348afc7eaa29770732d95";
const dayTime = ["night", "morning", "afternoon", "evening"];
const greet = ["Доброй ночи, ", "Доброе утро, ", "Добрый день, ", "Добрый вечер, "];
const numberOfImages = 20;

let bufferHour = -1, isUpdateBg = true;
let images = new Array(24);

function showTime() {
  let today = new Date(), hour = today.getHours(), min = today.getMinutes(), sec = today.getSeconds();

  time.innerHTML = `${capitalizeFirstLetter(moment().format('dddd'))}, ${moment().format('D MMMM')}<br>${addZero(hour)}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;
  setTimeout(showTime, 1000);
}

function addZero(n) {
  return (parseInt(n, 10) < 10 ? "0" : "") + n;
}

function setGreet() {
  let today = new Date(), hour = today.getHours();
  greeting.textContent = greet[Math.floor(hour / 6)];
}

function setBg() {
  let today = new Date(), hour = today.getHours();
  let image = new Image();

  image.src = "./assets/images/" + dayTime[Math.floor(hour / 6)] + "/" + images[hour] + ".jpg";
  image.onload = function() {
    document.body.style.backgroundImage = `url('${image.src}')`;
  };
}

function getPhotos() {
  let randomNum;
  for (let i = 0; i < 24; i++) {   
    while (true) {
      randomNum = Math.floor(Math.random() * (numberOfImages - 1)) + 1;     
      if (!images.slice(Math.floor(i / 6) * 6, Math.floor(i / 6) * 6 + 6).includes(randomNum)) {        
        images[i] = randomNum;
        break;
      }    
    }
  }
  setBg();
  addImagesToModal();

  bgChange.removeEventListener("click", getPhotos);
  setTimeout(function() { bgChange.addEventListener("click", getPhotos); }, 1000);
}

function getName() {
  if (localStorage.getItem("name") === null || localStorage.getItem("name") == "") {
    name.textContent = "Введите имя";
  } else {
    name.textContent = localStorage.getItem("name");
  }
}

function nameOnClick() {
  localStorage.setItem("name", name.textContent);
  name.textContent = "";
}

function setName(e) {
  if (e.type === "keypress") {
    if (e.key === "Enter") {
      if (e.target.innerText.length == "") {
        name.textContent = localStorage.getItem("name");
      } else {
        localStorage.setItem("name", e.target.innerText);
      }
      name.blur();
    }
  } else {
    if (e.target.innerText == "") {
      name.textContent = localStorage.getItem("name");
    } else {
      localStorage.setItem("name", e.target.innerText);
    }
  }
}

function getFocus() {
  if (localStorage.getItem("focus") === null || localStorage.getItem("focus") == "") {
    focus.textContent = "Введите задачу";
  } else {
    focus.textContent = localStorage.getItem("focus");
  }
}

function focusOnClick() {
  localStorage.setItem("focus", focus.textContent);
  focus.textContent = "";
}

function setFocus(e) {
  if (e.type === "keypress") {
    if (e.key === "Enter") {
      if (e.target.innerText.length == "") {
        focus.textContent = localStorage.getItem("focus");
      } else {
        localStorage.setItem("focus", e.target.innerText);
      }
      focus.blur();
    }
  } else {
    if (e.target.innerText == "") {
      focus.textContent = localStorage.getItem("focus");
    } else {
      localStorage.setItem("focus", e.target.innerText);
    }
  }
}

function setQuote() {
  var request = new XMLHttpRequest();
  request.open("GET", "https://api.adviceslip.com/advice" + "?timestamp=" + Date.now(), true);
  request.responseType = "json";
  request.send();

  request.onload = function () {
    if (request.status == 200) {
      let responseObj = request.response;
      quote.textContent = responseObj["slip"]["advice"];
    }
  };

  request.onerror = function() {
    quote.textContent = 'Ошибка при загрузке цитаты';
  };
}

function updateBg() {
  let today = new Date(), hour = today.getHours();
  if (bufferHour == -1) {
    bufferHour = hour;
  } else if (hour != bufferHour) {
    setBg();
    setGreet();
    addImagesToModal();
    bufferHour = hour;
  }
  setTimeout(updateBg, 1000 * 10);
}

function generateModal() {
  let mwindow = document.createElement("div");
  mwindow.id = "modal-window";
  mwindow.className = "modal";

  let mwindowContent = document.createElement("div");
  mwindowContent.className = "modal-content";
  mwindowContent.innerHTML = '<span class="close">&times;</span><br>';

  let content = document.createElement("div");
  content.className = "modal-main-content";
  mwindowContent.append(content);

  mwindow.append(mwindowContent);
  document.body.append(mwindow);

  document.getElementsByClassName("close")[0].onclick = function () {
    document.getElementById("modal-window").className = "modal-hide";
    document.getElementsByTagName("body")[0].style.overflow = "visible";
    changeClass();
  };

  openModal.onclick = function () {
    document.getElementById("modal-window").className = "modal-visible";
    document.getElementsByTagName("body")[0].style.overflow = "hidden";
  };

  window.onclick = function (event) {
    if (event.target == document.getElementById("modal-window")) {
      document.getElementById("modal-window").className = "modal-hide";
      document.getElementsByTagName("body")[0].style.overflow = "visible";
      changeClass();
    }
  };
}

async function changeClass() {
  await sleep(550);
  document.getElementById("modal-window").className = "modal";
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function addImagesToModal() {
  if (document.getElementById("modal-window") != null) {
    document.getElementById("modal-window").remove();
  }
  generateModal();

  let today = new Date(), hour = today.getHours();
  let modal = document.querySelector(".modal-main-content");
  let content = "";

  for (let i = hour; i < 24; i++) {
    content = content + `<img src="./assets/images/` + dayTime[Math.floor(i / 6)] + `/` + images[i] + `.jpg" width="600px"></img>`;    
  }
  for (let i = 0; i < hour; i++) {
      content = content + `<img src="./assets/images/` + dayTime[Math.floor(i / 6)] + `/` + images[i] + `.jpg" width="600px"></img>`;    
  }
  modal.innerHTML = content;
}

document.onkeydown = function (e) {
  e = e || window.event;
  if (e.key === "Escape") {
    if (document.getElementById("modal-window").className != "modal-hide" && document.getElementById("modal-window").className != "modal")  {
      document.getElementById("modal-window").className = "modal-hide";
      document.body.style.overflow = "visible";
      changeClass();
    }
  }
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getWeatherForecast() {
  var request = new XMLHttpRequest();
  request.open("GET", `https://api.openweathermap.org/data/2.5/weather?q=${localStorage.getItem('city')}&lang=ru&appid=${weatherAPI}&units=metric`, true);
  request.responseType = "json";
  request.send();

  request.onload = function () {
    if (request.status != 200 && request.status != 404) {
        if (document.getElementById("weather") != null) {
          document.getElementById("weather").remove();
        }  
    }
    else if (request.status == 404) {
      if (document.getElementById("weather") != null) {
        document.getElementById("weather").remove();
      }
    } else {
      setWeather(request.response);
    }
  };

  request.onerror = function () {
    if (document.getElementById("weather") != null) {
      document.getElementById("weather").remove();
    }  
  };
}

function setWeather(response) {
  let weather = document.createElement('div');
  weather.className = "weather";
  weather.id = "weather";
  weather.innerHTML = `<span><img class="weather-img" src="http://openweathermap.org/img/wn/${response['weather'][0]['icon']}.png">${Math.round(response['main']['temp'])}&deg;<br>${capitalizeFirstLetter(response['weather'][0]['description'])}</span>`;
  
  if (document.getElementById("weather") != null) {
    document.getElementById("weather").remove();
  }

  city.after(weather);
  setTimeout(getWeatherForecast, 1000 * 60 * 20);
}

function getCity() {
  if (localStorage.getItem("city") === null || localStorage.getItem("city") == "") {
    city.textContent = "Введите город";
  } else {
    city.textContent = localStorage.getItem("city");
  }
}

function cityOnClick() {
  localStorage.setItem("city", city.textContent);
  city.textContent = "";
}

function setCity(e) {
  if (e.type === "keypress") {
    if (e.key === "Enter") {
      if (e.target.innerText.length == "") {
        city.textContent = localStorage.getItem("city");
      } else {
        localStorage.setItem("city", e.target.innerText);
      }
      city.blur();
      getWeatherForecast();
    }  
  } else {
    if (e.target.innerText == "") {
      city.textContent = localStorage.getItem("city");
    } else {
      localStorage.setItem("city", e.target.innerText);
    }
    getWeatherForecast();
  }
}

name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
name.addEventListener("click", nameOnClick);
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);
focus.addEventListener("click", focusOnClick);
city.addEventListener("keypress", setCity);
city.addEventListener("blur", setCity);
city.addEventListener("click", cityOnClick);
quoteChange.addEventListener("click", setQuote);
bgChange.addEventListener("click", getPhotos);

getPhotos();
showTime();
setGreet();
setQuote();
getName();
getFocus();
getCity();
updateBg();
getWeatherForecast();