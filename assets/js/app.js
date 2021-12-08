
//import { showBarrows, showOws } from "../js/func.js";

const URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/ovdp?json';
const ratesURL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

import { createApp } from "../../node_modules/vue/dist/vue.esm-browser.prod.js";

createApp({
    data(){
        return {
            title1: "Period #1",
            title2: "Period #2",
            periodOne: {dateStart: "",
                        dateFinish: ""},
            dataArr: [],
            currency: [],

        }
    },

    computed: {
        borrowedSum(){
            
            function calc(date1, date2, arr){
                let sum = 0;
                    for (let item of arr){
                        if(item.paydate >= date1 && item.repaydate <= date2){
                            sum += item.attraction;
                        }
                    }
                    return sum;
            }
            return calc(this.periodOne.dateStart, this.periodOne.dateFinish, this.dataArr); 
        },

        owedSum(){
            function calc(date1, date2, arr){
                let sum = 0;
                    for (let item of arr){
                        if(item.paydate >= date1 && item.repaydate > date2){
                            sum += item.attraction;
                        }
                    }
                    return sum;
            }
            return calc(this.periodOne.dateStart, this.periodOne.dateFinish, this.dataArr); 
        }
    },
    async mounted(){
        
        let rates = await fetch(ratesURL);
        rates = await rates.json();
        this.currency = rates;


        let data = await fetch(URL);
        data = await data.json();

        data = data.map(item => {
            return {
                'paydate': item.paydate, 
                'repaydate': item.repaydate,
                'attraction': item.attraction,
                'valcode': item.valcode 
            } 
        });

        function swap(massive) {
            if (massive.length < 2) {
                return massive;
            } 
                    let tmp = massive[0];
                    massive[0] = massive[massive.length-1];
                    massive[massive.length-1] = tmp;
                    return massive;
        };

        for(let item of data) {
            for(let rate of this.currency) {
                if(item.valcode == rate.cc) {
                    item.attraction = item.attraction * rate.rate;
                    item.valcode = rate.cc + " in UAH";
                }
            };
            item.attraction = Math.round(item.attraction);
            item.paydate = item.paydate.split('.');
            item.repaydate = item.repaydate.split('.');
            item.paydate = swap(item.paydate).join('-');
            item.repaydate = swap(item.repaydate).join('-');
        };
        this.dataArr = data;
        console.log(this.dataArr, this.currency);
    }
}).mount('#app');


/*
periodOneBarrows() {
            return showBarrows(this.date1per1, this.date2per1);
        },
        periodOneOws() {
            return showOws(this.date1per1, this.date2per1);  
        },
        
        periodTwoBarrows() {
            return showBarrows(this.date1per2, this.date2per2);
        },
        periodTwoOws() {
            return showOws(this.date1per2, this.date2per2);  
        },

        percentOne(){
            if(this.periodTwoBarrows * this.periodOneBarrows !== 0){
                return Math.round(((this.periodTwoBarrows - this.periodOneBarrows) / this.periodOneBarrows) * 100);
            }
        },

        percentTwo(){
            if(this.periodTwoOws * this.periodOneOws !== 0){
                return Math.round(((this.periodTwoOws - this.periodOneOws) / this.periodOneOws) * 100);
            }
        }
*/