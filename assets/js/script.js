const url = 'https://ddragon.leagueoflegends.com/cdn/14.6.1/data/en_US/champion.json';

    fetch(url)
        .then (function (res) {
            return res.json()
        }) 
        .then (function (data) {
            console.log(data)
        })