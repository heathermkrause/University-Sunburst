var csv = require('csv'),
    fs = require('fs');

var universities = [];

function gocUniversity(name){
    var u = universities.find(function(o){ return o.name == name; });
    if(!u) {
        u = {id: universities.length + 1, name: name, categories : []}
        universities.push(u);
    }

    return u;
}

function gocCategory(id, un){
    var categories = un.categories,
        cat = categories.find(function(o){ return o.id == id});

    if(!cat){
        cat = { id : id, indicators : [] };
        categories.push(cat);
    }

    return cat;
}

function extractFromFile(name, cid, iid){
    fs.readFile(name, 'utf8', function(err, data){
        csv.parse(data, function(err, d){
            d.forEach(function(line){
                var uname = line[0],
                    score = line[line.length - 1];

                var indData = line.slice(1, line.length - 1);

                var cat = gocCategory(cid, gocUniversity(uname));

                var indicators = cat.indicators;

                cat.score = score;

                indData.forEach(function(value, index){
                    indicators.push({id: iid[index], value: value});
                });
            });
        });
    });
}

extractFromFile('app/data/csv/c1.csv', 1, [1, 2, 3, 4, 5, 6, 7]);
extractFromFile('app/data/csv/c2.csv', 2, [8, 9, 10, 11, 12]);
extractFromFile('app/data/csv/c3.csv', 3, [13, 14, 15, 16, 17]);
extractFromFile('app/data/csv/c4.csv', 4, [18, 19, 20]);
extractFromFile('app/data/csv/c5.csv', 5, [21, 22, 23, 24]);

setTimeout(function(){ fs.writeFile('app/data/university_scores.json', JSON.stringify(universities))}, 400)
