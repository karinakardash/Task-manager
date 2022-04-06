export function currentTime() {
   setInterval(function () {
      let date = new Date();

      let hours = date.getHours();
      let minutes = date.getMinutes();

      let day = date.getDate();
      let year = date.getFullYear();
      let monthNames = [
         "January", "February", "March",
         "April", "May", "June",
         "July", "August", "September",
         "October", "November", "December"];
      let month = monthNames[date.getMonth()];

      if (day < 10) day = " " + day;
      if (hours < 10) hours = "0" + hours;
      if (minutes < 10) minutes = "0" + minutes;

      let currentClock = hours + ":" + minutes;
      let currentDate = month + " " + day + ", " + year;

      document.getElementById("currentClock").innerHTML = currentClock;
      document.getElementById("currentDate").innerHTML = currentDate;

   }, 1000);
};