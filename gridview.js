var fs = require('fs');

var data = JSON.parse(fs.readFileSync('app/data/university_scores.json'));

function extract(name, cid) {
    return data.universities.filter(function (u) {
        return u.name == name;
    })[0].categories[cid].indicators.filter(ind => !isSkip(ind.id));
}

function extractCategory(name, cid){
    return data.universities.filter(function (u) {
        return u.name == name;
    })[0].categories[cid];
}

var isSkip = function(id){
    return data.indicators[id].skip;
};

var s = '';
var uns = [
    'Algoma',
    'Brock',
    'Carleton',
    'Guelph',
    'Lakehead',
    'Laurentian',
    'McMaster',
    'Nipissing',
    'OCADU',
    'Ottawa',
    'UOIT',
    'Queen\'s',
    'Ryerson',
    'Toronto',
    'Trent',
    'Waterloo',
    'Western',
    'Laurier',
    'Windsor',
    'York'
];

function col(v, size){
    var length = v.length;
    for(let i = 0, l = size - length; i < l; i++){
        v += ' ';
    }

    return v;
}

//var indicators = [8, 9, 10, 11, 12];
var res = '';
var colLength = 8;

var indicators;
var cat = 1;

uns.forEach(name => {
    var d = extract(name, cat);

    if(!indicators){
        indicators = d.map(ind => ind.id);

        // indicators.splice(2, 0, indicators[indicators.length - 1]);
        // indicators.splice(indicators.length - 1, 1);

    }

    // d.splice(2, 0, d[d.length - 1]);
    // d.splice(d.length - 1, 1);

    res += col(name, 14);

    res += d.map(o => col(o.value, colLength)).join('') + "\n";
});
res = col('', 14) + indicators.map(id => col('[' + id + ']', colLength)).join('') + "\n" + res;

//console.log(res);

res = '';
uns.forEach(un => {
    var d = extractCategory(un, 4);
    res += col(un, 14) + d.score + "\n";
});

console.log(res);
