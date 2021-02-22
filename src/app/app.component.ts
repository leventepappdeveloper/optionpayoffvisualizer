import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FinanceServiceService } from './services/finance-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private service: FinanceServiceService) {}

  title = "Levente's Stock Price & Volume Visualizer";
  timeframes = [
        {id:0, timeframe: 0, label:'1 Day', selected: false},
        {id:1, timeframe: 4, label:'1 Week', selected: false},
        {id:2, timeframe: 20, label:'1 Month', selected: false},
        {id:3, timeframe: 62, label:'3 Months', selected: false},
        {id:4, timeframe: 125, label:'6 Months', selected: false},
        {id:5, timeframe: 251, label:'1 Year', selected: false},
        {id:6, timeframe: 1288, label:'5 Years', selected: false},
        {id:7, timeframe: undefined, label:'Max', selected: false}
      ];
  
  date$ = [];
  lineData$ = [];
  barData$ = [];
  lineCount: number;
  keyword = '';
  searchResults = [];
    
  a = 1;
  public showHideExpirations() 
  {
    if (this.a == 1)
    {
      document.getElementById("expirationsDropDownBox").style.display = "inline-block";
      document.getElementById("optionsChainButton").style.display = "inline-block";
      return this.a = 0;
    }
    else
    {
      document.getElementById("expirationsDropDownBox").style.display = "none";
      document.getElementById("optionsChainButton").style.display = "none";
      return this.a = 1;
    }
  }

  b = 1;
  public showHideOptionsChain() 
  {
    if (this.b == 1)
    {
      // options chain should show up
      return this.b = 0;
    }
    else
    {
      // options chain should disappear
      return this.b = 1;
    }
  }


  // GRAPH STUFF

  public chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        id: 'left-y-axis',
          type: 'linear',
          position: 'left'
        }, {
          id: 'right-y-axis',
          type: 'linear',
          position: 'right'
        }]
      }
  };
  public chartLabels = this.date$;
  public chartLegend = true;
  public chartData = [{data: this.lineData$, label: 'Price', yAxisID: 'right-y-axis', type: 'line'},
                      {data: this.barData$, label: 'Volume', yAxisID: 'left-y-axis'}];
  
  onKeyup(key: Array<any>){
    this.keyword += key['key'];
    console.log(this.keyword);
    this.service.search(this.keyword)
    .subscribe(data => {
      let searchdata = data['bestMatches'];
      for(let i=0; i<searchdata.length; i++){
        this.searchResults.push({symbol: searchdata[i]['1. symbol'], name: searchdata[i]['2. name']})
      }
      console.log(this.searchResults);
    });
  }
  onChange(event: Array<any>){
    console.log(event);
    let line = [];
    let bar = [];
    this.service.getData(event['srcElement']['value'])
    .subscribe(data => {
      console.log(data);
      this.date$ = Object.keys(data['Time Series (Daily)']);
      this.chartLabels = this.date$.reverse();
      let daily = Object.keys(data['Time Series (Daily)']).map(e=>data['Time Series (Daily)'][e]);
      daily.forEach(function(day){
        line.unshift(day['4. close']);
        bar.unshift(day['5. volume']);
      })
      this.chartData[0].data = line;
      this.chartData[1].data = bar;
      this.lineCount = bar.length - 1;
      this.lineData$ = line;
      this.barData$ = bar;
    })
  }

  onTimeChange(timeframe: number){
    console.log(timeframe);
    let line = [];
    let bar = [];
    let dates = [];
    for(let i=0; i<timeframe; i++) {
      dates.unshift(this.date$[this.lineCount-i]);
      line.unshift(this.lineData$[this.lineCount-i]);
      bar.unshift(this.barData$[this.lineCount-i]);
    }
    this.chartLabels = dates;
    this.chartData[0].data = line;
    this.chartData[1].data = bar;
  }

  onGetOptionsData() {
    this.service.getExpirations()
    .subscribe(data => {
      console.log(data);
    });
  }
}
