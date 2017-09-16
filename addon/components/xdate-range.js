import Ember from 'ember';
import layout from '../templates/components/xdate-range';

export default Ember.Component.extend({
  	layout,
  	startRange:[],
	endRange:[],
	startDay:null,
	startMonth:null,
	startDateValue:null,
	endDateValue:null,
	startYear:null,
	endDay:null,
	endMonth:null,
	endYear:null,
	showStartCalendar:true,
	showEndCalendar:true,
	disbaledApply:false,
	showApplyBtnObserver:Ember.observer('startDay','startMonth','startYear','endDay','endMonth','endYear',function(){
		if(!this.get('startDay')|!this.get('endDay')){
			this.set('disbaledApply',true);
		}
		else{
			let _f=new Date().setFullYear(this.get('startYear'),this.get('startMonth'),this.get('startDay'));
			let _s=new Date().setFullYear(this.get('endYear'),this.get('endMonth'),this.get('endDay'));
			if(_f<=_s){
				this.set('disbaledApply',false);
			}
			else{
				this.set('disbaledApply',true);
			}	
		}
		
	}),
	months:[
		[{label:'January',value:0},{label:'February',value:1},{label:'March',value:2}],
		[{label:'April',value:3},{label:'May',value:4},{label:'June',value:5}],
		[{label:'July',value:6},{label:'August',value:7},{label:'September',value:8}],
		[{label:'October',value:9},{label:'November',value:10},{label:'December',value:11}]
	],
	dateOptions:[
		{label:'Fixed'},
		{label:'Last 7 days'},
		{label:'Last 14 days'},
		{label:'Last 28 days'},
		{label:'Last 30 days'},
		{label:'Today'},
		{label:'Yesterday'},
		{label:'This week (starts sunday)'},
		{label:'Last week(start sunday)'},
		{label:'This week (starts monday)'},
		{label:'Last week(start monday)'},
		{label:'This month'},
		{label:'Last month'},
		{label:'This quarter'},
		{label:'Last quarter'},
		{label:'This year'},
		{label:'Last year'},
	{label:'All Date Range'}],
	selectedDateOption:Ember.computed('dateOptions',function(){
		return this.get('dateOptions')[0];
	}),
	didInsertElement(){
		this.setToday();
	},
	setToday() {
		var now   = new Date();
		var day   = now.getDate();
		var month = now.getMonth();
		var year  = now.getFullYear();
		
		// if (year < 2000)    
		// year = year + 1900; 
		
		this.focusDay = day;
		
		this.displayCalendar('startRange',month, year);
		this.displayCalendar('endRange',month, year);
	},
	isLeapYear (Year) {
		if (((Year % 4)==0) && ((Year % 100)!=0) || ((Year % 400)==0)) {
		return (true);
		} else { return (false); }
	},
	getDaysInMonth(month,year)  {
		var days;
		if (month==1 || month==3 || month==5 || month==7 || month==8 || month==10 || month==12)  days=31;
		else if (month==4 || month==6 || month==9 || month==11) days=30;
		else if (month==2)  {
		if (this.isLeapYear(year)) { days=29; }
		else { days=28; }
		}
		return (days);
	},	
	isFourDigitYear(year) {
		year=String(year);
		if (year.length != 4) {
		 return false;
		} else { return true; }
	},
	setNextMonth(option) {
		let year=null;
		let month=null;
		if(option=='start'){
			year=this.get('startYear');
			month=this.get('startMonth');
		}
		else{
			year=this.get('endYear');
			month=this.get('endMonth');
		}
		// if (this.isFourDigitYear(year)) {
		var day   = 0;
		if (month == 11) {
		month = 0;
		year++;

		} else { month++; }
		if(option=='start'){
			this.displayCalendar('startRange',month,year);
		}
		else{
			this.displayCalendar('endRange',month,year);
		}
		// }
	},
	setPreviousMonth(option) {
		let year=null;
		let month=null;
		if(option=='start'){
			year=this.get('startYear');
			month=this.get('startMonth');
		}
		else{
			year=this.get('endYear');
			month=this.get('endMonth');
		}
		// if (this.isFourDigitYear(year)) {
		var day   = 0;
		if (month == 0) {
		month = 11;
		if (year > 1000) {
		year--;
		}
		} else { month--; }
		if(option=='start'){
			this.displayCalendar('startRange',month,year);
		}
		else{
			this.displayCalendar('endRange',month,year);
		}
	   // }
	},
	displayCalendar(array,month, year) {  
		month = parseInt(month);
		year = parseInt(year);
		var i = 0;
		var days = this.getDaysInMonth(month+1,year);
		var firstOfMonth = new Date ();
		firstOfMonth.setFullYear(year, month, 1);
		var startingPos = firstOfMonth.getDay();
		if(array=='startRange'){
			this.set('startMonth',month);
			this.set('startYear',year);
			this.set('startDay',null);
		}
		else{
			this.set('endMonth',month);
			this.set('endYear',year);  	
			this.set('endDay',null);
		}
		days += startingPos;
		let first=[];
		let second=[];
		for (i = 0; i < startingPos; i++) {
		if ( i%7 == 0 ) {first.push(second);second=[];};
		second.push(null);
		}
		for (i = startingPos; i < days; i++) {
		if ( i%7 == 0 ) {first.push(second);second=[];};
		second.push(i-startingPos+1);
		}
		for (i=days; i<42; i++)  {
		if ( i%7 == 0 ) {first.push(second);second=[];};
		second.push(null);
		}
		first.push(second);
		this.set(array,first);
		if(array=="startRange"){
			this.set('showStartCalendar',true);
			this.set('startDateValue',firstOfMonth.toLocaleDateString("en-US", {year: 'numeric', month: 'long', }));
		}
		else{
			this.set('showEndCalendar',true);
			this.set('endDateValue',firstOfMonth.toLocaleDateString("en-US", {year: 'numeric', month: 'long', }));
		}
	},
	actions:{
		previousStart(){
			this.setPreviousMonth('start');
		},
		nextStart(){
			this.setNextMonth('start');
		},
		previousEnd(){
			this.setPreviousMonth('end');
		},
		nextEnd(){
			this.setNextMonth('end');
		},
		startDateFlatButton(){
			this.set('showStartCalendar',false);
			this.set('startDateValue',this.get('startYear'));
		},
		endDateFlatButton(){
			this.set('showEndCalendar',false);
			this.set('endDateValue',this.get('endYear'));
		},
		setStartMonth(month){
			this.displayCalendar('startRange',month.value,this.get('startYear'));
		},
		setEndMonth(month){
			this.displayCalendar('endRange',month.value,this.get('endYear'));
		},
		startYearChange(year){
			let _y=year;
			// for(let i=0;i<4;i++){
			// 	if(_y.length<4){
			// 		_y="0"+_y;
			// 	}
			// }
			// console.log(year,typeof(year));
			this.set('startYear',_y);
		},
		endYearChange(year){
			let _y=year;
			// for(let i=0;i<4;i++){
			// 	if(_y.length<4){
			// 		_y="0"+_y;
			// 	}
			// }
			this.set('endYear',_y);
		},
		setStartDay(day){
			this.set('startDay',day);
		},
		setEndDay(day){
			this.set('endDay',day);
		},
		sendDate(){
			let range={
						start:{
								day:this.get('startDay'),
								month:this.get('startMonth'),
								year:this.get('startYear')
							},
						end:{
								day:this.get('endDay'),
								month:this.get('endMonth'),
								year:this.get('endYear')	
							}
						};
			console.log(range);
			this.sendAction('sendDate',range);
		}
	}
});
