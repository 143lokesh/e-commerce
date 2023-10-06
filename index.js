const userTab = document.querySelector("[data-usewWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userInfoContainer = document.querySelector(".user-weather-info");
const searchForm =document.querySelector(".form-container");
const grantAccess=document.querySelector(".grant-access-container");
const loadingScreen=document.querySelector(".loading-container");
let currentTab=userTab;
const API_key="fd8707ce7bc5746cec36163616751e93";
currentTab.classList.add("current-tab");

function switchTab(clickedTab){
    if(clickedTab!=currentTab){
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");
        if(!searchForm.classList.contains("active")){
            userInfoContainer.classList.remove("active");
            grantAccess.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            getFromSessionStorage();
        }
    }
}
grantAccess.classList.add("active");
userTab.addEventListener("click", ()=>{
    switchTab(userTab);
});
searchTab.addEventListener("click", ()=>{
    switchTab(searchTab);
});
function getFromSessionStorage(){
    const localCoordinates=sessionStorage.getItem("user-coordinates");
    if(!localCoordinates){
        grantAccess.classList.add("active");
    }
    else{
        const coordinates=JSON.parse(localCoordinates);
        fetchUserWeatherInfo(coordinates);
    }
}
function renderWeatherInfo(data){
   const cityname=document.querySelector("[data-cityname]");
   const countryIcon=document.querySelector("[data-cityicon]");
   const weatherDesc=document.querySelector("[data-weatherDesc]");
   const weatherIcon=document.querySelector("[data-weatherIcon]");
   const temp=document.querySelector("[data-temp]");
   const windspeed=document.querySelector("[data-windspeed]");;
   const humidity=document.querySelector("[data-humidity]");
   const cloudiness=document.querySelector("[data-cloudiness]");
    if(!data?.name){
        userInfoContainer.classList.remove("active"); 
        erroroccur.classList.add("active");
    }
    else{
   cityname.innerText=data?.name;
   countryIcon.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
   weatherDesc.innerText=data?.weather?.[0]?.description;
   weatherIcon.src=`https://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
   temp.innerText=`${data?.main?.temp} °C`;
   windspeed.innerText=`${data?.wind?.speed} m/s`;
   humidity.innerText=`${data?.main?.humidity} %`;
   cloudiness.innerText=`${data?.clouds?.all} %`;
   erroroccur.classList.remove("active");
    }
   
}

async function fetchUserWeatherInfo(coordinates){

    const {lat,lon}=coordinates;
    grantAccess.classList.remove("active");
    loadingScreen.classList.add("active");

    try{
        const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data =await response.json();
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){

    }
}

function getlocation(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{

    }
}
function showposition(position){
    const usercoordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates",JSON.stringify(usercoordinates));
    fetchUserWeatherInfo(usercoordinates);
}
const grantAccessButton=document.querySelector("[data-grantaccess]");
grantAccessButton.addEventListener("click",getlocation);

const searchInput=document.querySelector("[data-searchcity]");
searchForm.addEventListener("submit",(e)=>{
    e.preventDefault();
  
  if(searchInput.value==="") return ;

  fetchSearchWeatherInfo(searchInput.value);
});
const erroroccur=document.querySelector(".error");
async function fetchSearchWeatherInfo(city){
  loadingScreen.classList.add("active");
  grantAccess.classList.remove("active");
  userInfoContainer.classList.remove("active");
  try{
    const response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
    const data=await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  }
  catch(err){
        // userInfoContainer.classList.remove("active"); 
        // erroroccur.classList.add("active");
  }
}