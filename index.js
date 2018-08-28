const syncRequest = require('sync-request');
const parse = require('csv-parse/lib/sync');
const fs = require('fs');

const lastDownloadedFile = 'sounds/lastFileDownloaded.txt';
const soundEffectCSV = fs.readFileSync('BBCSoundEffects.csv', 'utf8');

return downloadStuff()
.catch(err => {
    retry(10, function () { return downloadStuff(); });
});

function downloadStuff() {
    return new Promise(resolve => resolve(soundEffectCSV))
    .then(soundEffectCSV => {
        let samples = parse(soundEffectCSV, {columns: true});
        const lastDownloaded = fs.readFileSync(lastDownloadedFile, 'utf8');

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
            const filename = `sounds/${description.substring(0, 235)} - ${sample.location}`;

            console.log(`downloading then saving ${filename}`);

            if (!fs.existsSync(filename)) {
                //yes this is a sync http call, this is so the BBC doesn't get angry at us for demolishing their servers
                const response = syncRequest('GET', `http://bbcsfx.acropolis.org.uk/assets/${sample.location}`);

                fs.writeFileSync(filename, response.getBody());
                fs.writeFileSync(lastDownloadedFile, sample.location);
            }
        });
    })
}

function retry(maxRetries, fn) {
    return fn().catch(function(err) {
        console.log("Oops, something wen't wrong");
        if (maxRetries <= 0) {
            throw err;
        }

        console.log(`${maxRetries} retries left`);
        return retry(maxRetries - 1, fn);
    });
}
