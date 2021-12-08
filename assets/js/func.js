    const URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/ovdp?json';
    const ratesURL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

    let rates = await fetch(ratesURL);
    rates = await rates.json();

    let data = await fetch(URL);
    data = await data.json();

    //console.log(data)

    data = data.map(item => {
        return {
            'paydate': item.paydate, 
            'repaydate': item.repaydate,
            'attraction': item.attraction,
            'valcode': item.valcode 
        } 
    });

    for(let item of data) {
        for(let rate of rates) {
            if(item.valcode == rate.cc) {
                item.attraction = item.attraction * rate.rate;
                item.valcode = rate.cc + " in UAH";
            }
        };
        item.attraction = Math.round(item.attraction);
        item.attraction = Math.round(item.attraction);
        item.paydate = item.paydate.split('.');
        item.repaydate = item.repaydate.split('.');
        item.paydate = swap(item.paydate).join('-');
        item.repaydate = swap(item.repaydate).join('-');
        
    };

    function swap(massive) {
        if (massive.length < 2) {
            return massive;
        } 
                let tmp = massive[0];
                massive[0] = massive[massive.length-1];
                massive[massive.length-1] = tmp;
                return massive;
    };

    console.log(data)


    function showBarrows(date1, date2) {

        // const parse = dateString => {
        //     const [d, m, y] = dateString.split('-');
        //     return new Date(y, m-1, d)
        // };


        // date1 = parse(date1);
        // date2 = parse(date2);

        let borrowed = 0;
        let owed = 0;
        
        for(let item of data) {
            if(item.paydate >= date1 && item.repaydate <= date2){
                borrowed += item.attraction;
            
            } else if (item.paydate >= date1 && item.repaydate > date2) {
                owed += item.attraction;
            };
        };
        return {borrowed, date1, date2};
        //return {date1, date2}
    };

    function showOws(date1, date2) {
        let borrowed = 0;
        let owed = 0;
        
        for(let item of data) {
            if(item.paydate >= date1 && item.repaydate <= date2){
                borrowed += item.attraction;
            
            } else if (item.paydate >= date1 && item.repaydate > date2) {
                owed += item.attraction;
            }
        }; 
        return {owed, date1, date2};
    }

    console.log(showBarrows("2017-02-03", "2021-12-08"))
    console.log(showOws("2017-02-03", "2021-12-08"))

    export {showBarrows, showOws};
