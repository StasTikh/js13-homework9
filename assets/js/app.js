
import { showBarrows, showOws } from "../js/func.js";

import { createApp } from "../../node_modules/vue/dist/vue.esm-browser.prod.js";

createApp({
    data(){
        return {
            title1: "Period #1",
            title2: "Period #2",
            date1per1: "",
            date2per1: "",
            date1per2: "",
            date2per2: ""
        }
    },
    computed: {
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
    }
}).mount('#app');