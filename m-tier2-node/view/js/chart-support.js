var spendingChart;
var spendingChartData;
var spendingChartSelectedRow;
var spendingChartSelectedCategory;

var incomeChart;
var incomeChartData;
var incomeChartSelectedRow;
var incomeChartSelectedCategory;

const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];


function drawSpendingPieChart(rows,chartElementId,summaryElementId) {
    spendingChartData = []; //reset chart data upon rendering
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Cost');
    var totalSpending = 0.0;
    var categorizedSpending = {};
    for(var i=0;i < rows.length; i++) {
        if(rows[i].amount < 0 && rows[i].category !== 'Ignore') {
            totalSpending += Math.abs(rows[i].amount);
            var currentCategory = getCategory(rows[i].category);
            if(categorizedSpending[currentCategory]) {
                categorizedSpending[currentCategory] += Math.abs(rows[i].amount);
            } else {
                categorizedSpending[currentCategory] = Math.abs(rows[i].amount);
            }
        }
    }
    Object.keys(categorizedSpending).forEach(function(key,index) {
        try {
            spendingChartData.push([key,{v: categorizedSpending[key],f: '$'+formatMoney(categorizedSpending[key],2,'.',',')}]);
        } catch(e) {
            console.log(e);
        }
    });
    data.addRows(spendingChartData);

    if(summaryElementId) {
        $("#"+summaryElementId).text("Total Expenses $"+formatMoney(totalSpending,2,'.',','));
    }
    spendingChart = new google.visualization.PieChart(document.getElementById(chartElementId));

    spendingChart.draw(data, {
        legend: 'right',
        titlePosition: 'none'
    });

    google.visualization.events.addListener(spendingChart, 'select', function() {
        renderSpendingTable();
    });
}

function drawIncomePieChart(rows,chartElementId,summaryElementId) {
    incomeChartData = []; //reset chart data upon rendering
    var data = new google.visualization.DataTable();
    data.addColumn('string', 'Category');
    data.addColumn('number', 'Amount');
    var totalIncome = 0.0;
    var categorizedIncome = {};
    for(var i=0;i < rows.length; i++) {
        if(rows[i].amount > 0 && rows[i].category !== 'Ignore') {
            totalIncome += Math.abs(rows[i].amount);
            var currentCategory = getCategory(rows[i].category);
            if(currentCategory == null || currentCategory.trim() == '') {
                currentCategory = "Uncategorized";
            }
            if(categorizedIncome[currentCategory]) {
                categorizedIncome[currentCategory] += Math.abs(rows[i].amount);
            } else {
                categorizedIncome[currentCategory] = Math.abs(rows[i].amount);
            }
        }
    }
    Object.keys(categorizedIncome).forEach(function(key,index) {
        try {
            incomeChartData.push([key,{v: categorizedIncome[key],f: '$'+formatMoney(categorizedIncome[key],2,'.',',')}]);
        } catch(e) {
            console.log(e);
        }
    });
    data.addRows(incomeChartData);

    if(summaryElementId) {
        $("#"+summaryElementId).text("Total Income $"+formatMoney(totalIncome,2,'.',','));
    }
    incomeChart = new google.visualization.PieChart(document.getElementById(chartElementId));

    incomeChart.draw(data, {
        legend: 'right',
        sliceVisibilityThreshold: .000001
    });

    google.visualization.events.addListener(incomeChart, 'select', function() {
        renderIncomeTable();
    });
}

function drawSpendingBarChart(rows) {
    var data = new google.visualization.DataTable();
    var dateOrdered = [];
    var categories = {};
    var chartData = [];
    for(var i=0;i < rows.length; i++) {
        var txDate = new Date(rows[i].transaction_date);
        var currentDate = new Date();
        var monthName = monthNames[txDate.getMonth()];
        if(currentDate.getMonth() == txDate.getMonth() && currentDate.getFullYear() !== txDate.getFullYear()) {
            continue; //ignore current month if years do not match
        }
        if(!rows[i].category) {
            rows[i].category = "Uncategorized";
        }
        if(rows[i].amount < 0 && rows[i].category !== 'Ignore' && rows[i].category.indexOf('Savings') == -1) { //loop through all results
            var category = rows[i].category;
            var amount = Math.abs(rows[i].amount);
            var monthIdx = containsValue(dateOrdered,monthName);
            categories[category] = true;
            if(monthIdx !== -1) { //if month already exists
                if(dateOrdered[monthIdx][category]) {
                    dateOrdered[monthIdx][category] += amount;
                } else {
                    dateOrdered[monthIdx][category] = amount;
                }
            } else {
                var monthCategory = {};
                monthCategory[category] = amount;
                monthCategory['Month'] = monthName;
                dateOrdered.push(monthCategory);
            }
        }
    }
    for(var i=0;i < dateOrdered.length; i++) { //for every month
        Object.keys(categories).sort().forEach(function(category,index) { //check if category exists, if not add it and set it to 0
            if(!dateOrdered[i][category]) {
                dateOrdered[i][category] = 0;
            }
        });
        var monthRow = [dateOrdered[i].Month];
        Object.keys(dateOrdered[i]).sort().forEach(function(attribute,index) { //check if category exists, if not add it and set it to 0
            if(attribute !== 'Month') {
                //monthRow.push(dateOrdered[i][attribute]);
                monthRow.push({v: dateOrdered[i][attribute],f: '$'+formatMoney(dateOrdered[i][attribute],2,'.',',')});
            }
        });
        chartData.push(monthRow);
    }
    data.addColumn('string','Month')
    Object.keys(categories).sort().forEach(function(category,index) {
        data.addColumn('number',category);
    });
    
    // Object.keys(categorized).forEach(function(key,index) {
    //     try {
    //         chartData.push([key,{v: categorized[key],f: '$'+formatMoney(categorized[key],2,'.',',')}]);
    //     } catch(e) {
    //         console.log(e);
    //     }
    // });
    data.addRows(chartData);

    var chart = new google.visualization.ColumnChart(document.getElementById('barChart'));

    chart.draw(data, {
        legend: 'right',
        isStacked: true,
        vAxis: {format: 'currency'}
    });
}

function drawDiscretionarySpendingBarChart(rows) {
    var data = new google.visualization.DataTable();
    var dateOrdered = [];
    var categories = {};
    var chartData = [];
    for(var i=0;i < rows.length; i++) {
        var txDate = new Date(rows[i].transaction_date);
        var currentDate = new Date();
        var monthName = monthNames[txDate.getMonth()];
        if(currentDate.getMonth() == txDate.getMonth() && currentDate.getFullYear() !== txDate.getFullYear()) {
            continue; //ignore current month if years do not match
        }
        if(!rows[i].category) {
            rows[i].category = "Uncategorized";
        }
        if(rows[i].amount < 0 && rows[i].category !== 'Ignore' && 
            rows[i].category.indexOf('Savings') == - 1 && 
            rows[i].category.indexOf('Bill') == -1 && 
            rows[i].category.indexOf('Mortgage') == -1 &&
            rows[i].category.indexOf('Business') == -1 &&
            rows[i].category.indexOf('Education') == -1 &&
            rows[i].category.indexOf('Child Care') == -1 &&
            rows[i].category.indexOf('Insurance') == -1 &&
            rows[i].category.indexOf('Taxes') == -1 &&
            rows[i].category.indexOf('Professional') == -1 &&
            rows[i].category.indexOf('Income') == -1){ //loop through all results

            var monthName = monthNames[new Date(rows[i].transaction_date).getMonth()];
            var category = rows[i].category;
            var amount = Math.abs(rows[i].amount);
            var monthIdx = containsValue(dateOrdered,monthName);
            categories[category] = true;
            if(monthIdx !== -1) { //if month already exists
                if(dateOrdered[monthIdx][category]) {
                    dateOrdered[monthIdx][category] += amount;
                } else {
                    dateOrdered[monthIdx][category] = amount;
                }
            } else {
                var monthCategory = {};
                monthCategory[category] = amount;
                monthCategory['Month'] = monthName;
                dateOrdered.push(monthCategory);
            }
        }
    }
    for(var i=0;i < dateOrdered.length; i++) { //for every month
        Object.keys(categories).sort().forEach(function(category,index) { //check if category exists, if not add it and set it to 0
            if(!dateOrdered[i][category]) {
                dateOrdered[i][category] = 0;
            }
        });
        var monthRow = [dateOrdered[i].Month];
        Object.keys(dateOrdered[i]).sort().forEach(function(attribute,index) { //check if category exists, if not add it and set it to 0
            if(attribute !== 'Month') {
                //monthRow.push(dateOrdered[i][attribute]);
                monthRow.push({v: dateOrdered[i][attribute],f: '$'+formatMoney(dateOrdered[i][attribute],2,'.',',')});
            }
        });
        chartData.push(monthRow);
    }
    data.addColumn('string','Month')
    Object.keys(categories).sort().forEach(function(category,index) {
        data.addColumn('number',category);
    });

    data.addRows(chartData);

    var chart = new google.visualization.ColumnChart(document.getElementById('discretionarySpendingBarChart'));

    chart.draw(data, {
        legend: 'right',
        isStacked: true,
        vAxis: {format: 'currency'}
    });
}

function containsValue(arr,val) {
    for(var i=0;i < arr.length; i++) {
        if(arr[i].Month === val) {
            return i;
        }
    }
    return -1;
}

function renderSpendingTable() {
    var selection = spendingChart.getSelection();
    if(!selection[0]) {
        console.log("deselected");
        return;
    }
    var row = selection[0].row;
    spendingChartSelectedCategory = spendingChartData[row][0];
    var duration = $("#duration").val();
    $('#spendingTotalCategory').text(spendingChartSelectedCategory +' Expenses: '+spendingChartData[row][1].f);
    invoke('GET','/dashboard/tx/'+spendingChartSelectedCategory+'/'+duration,'',function(result) {
        $("#spendingTableHeader").text('Category: ' + result[0].category);
        updateTable(result,'spendingTable',false);
    }, function(err) {
        console.log(err);
    });
}

function renderPassiveTable() {
    var duration = $("#passive-duration").val();
    invoke('GET','/dashboard/passive/'+duration,'',function(result) {
        //$("#spendingTableHeader").text('Category: ' + result[0].category);
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Bill Name');
        data.addColumn('boolean', 'Covered');
        data.addColumn('number', 'Covered Percent');
        data.addColumn('number', 'Avg. Monthly Bill Amount');
        var tableData = [];
        if(result.bills) {
            for(var i=0;i < result.bills.length; i++) {
                if(result.bills[i].reimbursed) {
                    continue; //skip bill since it's reimbursed
                }
                tableData.push(
                    [
                        result.bills[i].name,
                        result.bills[i].covered,
                        {v: result.bills[i].coveredPercent,f: (result.bills[i].coveredPercent * 100.0).toFixed(2)+"%"},
                        {v: result.bills[i].monthly,f: '$'+formatMoney(result.bills[i].monthly,2,'.',',')}
                    ]
                );   
            }
        }
        data.addRows(tableData);
        for (var i = 0; i < data.getNumberOfRows(); i++) { //highlight rows
            var percentComplete = data.getValue(i,2);
            if(percentComplete == 1.0) {
                data.setProperty(i,2, 'style', 'background-color:#CFC;');
            } else if(percentComplete < 1.0 && percentComplete > 0) {
                data.setProperty(i,2, 'style', 'background-color:#FFC;');
            } else {
                data.setProperty(i,2, 'style', 'background-color:#FCC;');
            }
        }
        var table = new google.visualization.Table(document.getElementById('passiveTable'));
        table.draw(data, {showRowNumber: true, allowHtml: true,width: '100%', height: '100%'});
    }, function(err) {
        console.log(err);
    });
}

function renderIncomeTable() {
    var selection = incomeChart.getSelection();
    if(!selection[0]) {
        console.log("deselected");
        return;
    }
    var row = selection[0].row;
    incomeChartSelectedCategory = incomeChartData[row][0];
    var duration = $("#duration").val();
    $('#incomeTotalCategory').text(incomeChartSelectedCategory +' Revenue: '+incomeChartData[row][1].f);
    console.log(incomeChartSelectedCategory);
    invoke('GET','/dashboard/tx/'+incomeChartSelectedCategory+'/'+duration,'',function(result) {
        $("#incomeTableHeader").text('Category: ' + result[0].category);
        updateTable(result,'incomeTable',true);
    }, function(err) {
        console.log(err);
    });
}

function drawCashFlowTable(rows) {
    var table = new google.visualization.DataTable();
    var monthOrdered = {};
    table.addColumn('string', 'Month');
    table.addColumn('number', 'Income');
    table.addColumn('number', 'Expenses');
    table.addColumn('number', 'Savings');
    for(var i=0;i < rows.length; i++) {
        if(rows[i].category && (rows[i].category.indexOf('Ignore') !== -1 || rows[i].category.indexOf('Savings') !== -1)) {
            continue;
        }
        var txDate = new Date(rows[i].transaction_date);
        var currentDate = new Date();
        var monthName = monthNames[txDate.getMonth()];
        if(currentDate.getMonth() == txDate.getMonth() && currentDate.getFullYear() !== txDate.getFullYear()) {
            continue; //ignore current month if years do not match
        }
        if(!monthOrdered[monthName]) { //create category if not exist
            monthOrdered[monthName] = {};
            monthOrdered[monthName]['name'] = monthName + ' '+txDate.getFullYear();
            monthOrdered[monthName]['income'] = 0;
            monthOrdered[monthName]['expenses'] = 0;
            monthOrdered[monthName]['remaining'] = 0;
        }
        if(rows[i].amount < 0) {
            monthOrdered[monthName]['expenses'] += Math.abs(rows[i].amount);
        } else {
            monthOrdered[monthName]['income'] += rows[i].amount;
        }
        monthOrdered[monthName]['remaining'] += rows[i].amount;
    }
    var data = [];
    Object.keys(monthOrdered).forEach(function(month,index) {
        data.push([
            monthOrdered[month].name,
            {v: monthOrdered[month].income,f:'$'+formatMoney(monthOrdered[month].income,2,'.',',')},
            {v: monthOrdered[month].expenses,f:'$'+formatMoney(monthOrdered[month].expenses,2,'.',',')},
            {v: monthOrdered[month].remaining,f:'$'+formatMoney(monthOrdered[month].remaining,2,'.',',')},
        ]);
    });
    table.addRows(data);
    var t = new google.visualization.AreaChart(document.getElementById('cashFlow'));
    t.draw(table, 
        {
            title: 'Available Cash Flow - Previous Months',
            width: '100%',
            height: '100%',
            vAxis: {format: 'currency'}
        }
    );
}

function getSelectedRow(data,category) {
    if(!data) {
        return -1;
    }
    for(var i=0;i < data.length; i++) {
        if(data[i][0] === category) {
            return i;
        }
    }
    return -1;
}

function renderUpcomingBills(rows,tableElementId) {
    var data = new google.visualization.DataTable();
      data.addColumn('date', 'Due Date');
      data.addColumn('string', 'Status');
      data.addColumn('string', 'Bill Name');
      data.addColumn('string', 'Payment Type');
      data.addColumn('string', 'Payment Method');
      data.addColumn('number', 'Amount');
      var tableData = [];
      var highlights = [];
      for(var i=0;i < rows.length; i++) {
        var daysInCol = "";
        var paymentTypeCol = "";
        if(rows[i].paid) {
            highlights.push({row: i,col: 1, color: 'green'});
            var paidText = rows[i].payment_type == 'Automatic'?"Automatically Paid":"Paid"
            daysInCol = "<i class='fa fa-check'></i> "+paidText+" $"+formatMoney(Math.abs(rows[i].last_paid_amount),2,'.',',')+" on "+formatShortDate(new Date(rows[i].last_paid_date));
        } else if(rows[i].due && rows[i].due.days < 0) {
            highlights.push({row: i,col: 1, color: 'red'});
            daysInCol = Math.abs(rows[i].due.days)+ " days past due";
            if(rows[i].payment_type == 'Manual' && rows[i].institution_url) {
                daysInCol += " <a class='badge badge-primary' target='_blank' href='"+rows[i].institution_url+"' noreferer noopener>Pay Now</a>";
            }
        } else {
            if(rows[i].due && rows[i].due.days < 7) {
                highlights.push({row: i,col: 1, color: '#d07200'});
            } else {
                highlights.push({row: i,col: 1, color: 'green'});
            }
            if(rows[i].payment_type == 'Automatic') {
                if(rows[i].payment_method == 'Credit Card') {
                    daysInCol = "<i class='far fa-credit-card'></i>";
                } else if(rows[i].payment_method == 'Bank Draft') {
                    daysInCol = "<i class='fas fa-money-bill-wave'></i>";
                }
                daysInCol += " Automatically ";
                if(rows[i].payment_method == 'Credit Card') {
                    daysInCol += "charged";
                } else if(rows[i].payment_method == 'Bank Draft') {
                    daysInCol += "drafted";
                }
                if(Math.abs(rows[i].due.days) == 0) {
                    daysInCol += " today";
                } else if(rows[i].due.days == 1) {
                    daysInCol += " tomorrow";
                } else {
                    daysInCol += " in " + rows[i].due.days+ " days";
                }
            } else {
                if(rows[i].payment_method == 'Check') {
                    daysInCol = "<i class='fas fa-money-check-alt'></i> ";
                }
                daysInCol += "Due ";
                if(Math.abs(rows[i].due.days) == 0) {
                    daysInCol += " today";
                } else if(rows[i].due.days == 1) {
                    daysInCol += " tomorrow";
                } else {
                    daysInCol += " in " + rows[i].due.days+ " days";
                }
            }
            if(rows[i].payment_type == 'Manual' && rows[i].institution_url) {
                daysInCol += " <a class='badge badge-primary' target='_blank' href='"+rows[i].institution_url+"' noreferer noopener>Pay Now</a>";
            }
            
        }
        paymentTypeCol = rows[i].payment_type;
        if(rows[i].payment_type == 'Mailed') {
            paymentTypeCol += " <a href='https://store.usps.com/' target='_blank' noopener noreferer class='badge badge-primary'>Order Stamps</a>";
        }
        var billname = rows[i].name;
        if(rows[i].institution_icon_url) {
            billname = "<img src='"+rows[i].institution_icon_url+"' width='12' height='12'/> "+billname;
        }
        tableData.push([new Date(rows[i].due.date),daysInCol,billname,paymentTypeCol,rows[i].payment_method,{v: rows[i].amount,f: '$'+formatMoney(rows[i].amount,2,'.',',')}]);
        
      }
      data.addRows(tableData);
      for(var i=0;i < highlights.length; i++) {
        data.setProperty(highlights[i].row, highlights[i].col, 'style', 'color: '+highlights[i].color);
      }
      

      var table = new google.visualization.Table(document.getElementById(tableElementId));

      table.draw(data, {showRowNumber: true, allowHtml: true,width: '100%', height: '100%'});
}

function updateTable(rows,tableElementId,renderIncome) {
    var data = new google.visualization.DataTable();
      data.addColumn('date', 'Date');
      data.addColumn('string', 'Description');
      data.addColumn('number', 'Amount');
      var tableData = [];
      for(var i=0;i < rows.length; i++) {
        var description = rows[i].description.trim().replace(/\s\s+/g, ' ');
        if(description.length > 30) {
          description = description.substring(0,30) + "...";
        }
        if(renderIncome) {
            if(rows[i].amount > 0) {
                tableData.push([new Date(rows[i].transaction_date),description,{v: rows[i].amount,f: '$'+formatMoney(rows[i].amount,2,'.',',')}]);
            }
        } else if(!renderIncome) {
            if(rows[i].amount < 0) {
                tableData.push([new Date(rows[i].transaction_date),description,{v: rows[i].amount,f: '$'+formatMoney(rows[i].amount,2,'.',',')}]);
            }
        }
      }
      data.addRows(tableData);

      var table = new google.visualization.Table(document.getElementById(tableElementId));

      table.draw(data, {showRowNumber: true, width: '100%', height: '100%'});
   }

   function getCategory(val) {
     if(val == undefined) {
       return "Uncategorized";
     }
     return val;
    }

    function formatMoney(n, c, d, t) {
      var c = isNaN(c = Math.abs(c)) ? 2 : c,
        d = d == undefined ? "." : d,
        t = t == undefined ? "," : t,
        s = n < 0 ? "-" : "",
        i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
        j = (j = i.length) > 3 ? j % 3 : 0;

      return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
    };

    function formatShortDate(date) {
        var dd = date.getDate();
        var mm = date.getMonth()+1; 
        var yyyy = date.getFullYear();
        return mm+"/"+dd+"/"+yyyy;
    }