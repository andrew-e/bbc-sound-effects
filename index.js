const request = require('request-promise-native');
const syncRequest = require('sync-request');
const parse = require('csv-parse/lib/sync');
const http = require('http');
const fs = require('fs');

const lastDownloadedFile = 'sounds/lastFileDownloaded.txt';

return request({
    method: 'GET',
    uri: 'http://bbcsfx.acropolis.org.uk/assets/BBCSoundEffects.csv',
    timeout: 30000,
})
.then(soundEffectCSV => {
    let samples = parse(soundEffectCSV, {columns: true});
    const lastDownloaded = fs.readFileSync(lastDownloadedFile, 'utf8');

    console.log('last = ' + lastDownloaded);

    if (lastDownloaded) {
        let slicePoint = 0;
        samples.forEach((sample, i) => {

            if (sample.location === lastDownloaded) {
                slicePoint = i+1;
            }
        });

        samples = samples.slice(slicePoint);
    }

    samples.forEach(sample => {
        const description = sample.description.replace(/[/\\?%*:|"<>.]/g, '');
        const filename = `sounds/${description}${sample.location}`;

        console.log(`downloading then saving ${filename}`);

        if (!fs.existsSync(filename)) {
            //yes this is a sync http call, this is so the BBC doesn't get angry at us for demolishing their servers
            const response = syncRequest('GET', `http://bbcsfx.acropolis.org.uk/assets/${sample.location}`);

            fs.writeFileSync(filename, response.getBody());
            fs.writeFileSync(lastDownloadedFile, sample.location);
        }
    });
})
.catch(err => {
    console.error("Oops, something wen't wrong");
    console.error(JSON.stringify(err));
});
