    const URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/ovdp?json';
    const ratesURL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json';

    let rates = await fetch(ratesURL);
    rates = await rates.json();

    let data = await fetch(URL);
    data = await data.json();

    console.log(data)

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
        
    };

    //console.log(data)


    function showBarrows(date1, date2) {

        date1 = date1.split('-');
        date2 = date2.split('-');
        
        function swap(massive) {
            if (massive.length < 2) {
                return massive;
            } 
                    let tmp = massive[0];
                    massive[0] = massive[massive.length-1];
                    massive[massive.length-1] = tmp;
                    return massive;
        };

        date1 = swap(date1).join('-');
        date2 = swap(date2).join('-');
        
        const parse = dateString => {
            const [d, m, y] = dateString.split('-');
            return new Date(y, m-1, d)
        };


        date1 = parse(date1);
        date2 = parse(date2);

        let borrowed = 0;
        let owed = 0;
        
        for(let item of data) {
            if(new Date(item.paydate) >= date1 && new Date(item.repaydate) <= date2){
                borrowed += item.attraction;
            
            } else if (new Date(item.paydate) >= date1 && new Date(item.repaydate) > date2) {
                owed += item.attraction;
            };
        };
        return borrowed;
        //return {date1, date2}
    };

    function showOws(date1, date2) {
        
        date1 = date1.split('-');
        date2 = date2.split('-');
        
        function swap(massive) {
            if (massive.length < 2) {
                return massive;
            } 
                    let tmp = massive[0];
                    massive[0] = massive[massive.length-1];
                    massive[massive.length-1] = tmp;
                    return massive;
        };

        date1 = swap(date1).join('-');
        date2 = swap(date2).join('-');
        
        const parse = dateString => {
            const [d, m, y] = dateString.split('-');
            return new Date(y, m-1, d)
        };
        date1 = parse(date1);
        date2 = parse(date2);
        
        let borrowed = 0;
        let owed = 0;
        
        for(let item of data) {
            if(new Date(item.paydate) >= date1 && new Date(item.repaydate) <= date2){
                borrowed += item.attraction;
            
            } else if (new Date(item.paydate) >= date1 && new Date(item.repaydate) > date2) {
                owed += item.attraction;
            }
        }; 
        return owed;
    }

    export {showBarrows, showOws};

    // let x = showBarrows('2017-01-01', '2021-12-31');
    // let y = showBarrows('2009-09-21', '2014-08-12');

    // let z = Math.round(((y - x) / x) * 100)

    // console.log(`X: ${x}, Y: ${y}, Z: ${z}`)
