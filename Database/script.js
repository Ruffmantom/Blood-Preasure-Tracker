let userdb = new Localbase('BPT-USERS-DB');
let chartdb = new Localbase('BPT-CHART-DB');
// helpers
let inc;
// init local storage increment
if(!localStorage.getItem('local-inc')){
    localStorage.setItem('local-inc','1');
    inc = 1;
}else{
    inc = parseInt(localStorage.getItem('local-inc'))
}

// create the tables
let usersTable = userdb.collection('user');
let usersChartTable = chartdb.collection('chart');