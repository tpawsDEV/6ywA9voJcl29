const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const compareTime = (firstDate: Date, secondDate: Date, asString = true) => {
  const totalDiff = (firstDate.getTime() - secondDate.getTime()) / 1000;
  let diffInMilliSeconds = totalDiff;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  const seconds = Math.floor(diffInMilliSeconds);

  if (hours === 0 && days === 0 && minutes === 0 && seconds < 3) {
    return 0;
  }
  if (asString) {
    return {
      days,
      hours,
      minutes,
      seconds,
    };
  } else {
    return totalDiff;
  }
};

const getTimeMessage = () => {
  return "";
  // var today = new Date();
  // var curHr = today.getHours();
  // if (curHr < 12) {
  //   return "Bom dia!{nl}";
  // } else if (curHr < 18) {
  //   return "Boa tarde!{nl}";
  // } else {
  //   return "Boa noite!{nl}";
  // }
};
export { compareTime, sleep, getTimeMessage };
