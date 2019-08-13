const readline = require('readline');
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const ytdl = require('ytdl-core');
const sanitize = require('sanitize-filename');

const app = express();

app.use(cors());

app.listen(4000, () => {
    console.log('[NOTICE]: SERVER WORKING AT PORT 4000');
});

app.get('/download', (req,res) => {
    var url = req.query.URL;

    // Get video info
    ytdl.getInfo(url, (err, info) => {
        if(err){
            console.log('[ERROR]: INVALID URL');
            return;
        }
        console.log('[TITLE]: ', sanitize(info.title));
        console.log('[AUTHOR]: ', info.author.name);
        var title = sanitize(info.title) + '.mp3';
        var audioPath = path.resolve('./Songs/', title);

        // Get audio stream
        var audioStream = ytdl(url, {
        quality: 'highestaudio',
        filter: 'audio'
        });

        // Display download progress
        audioStream.on('progress', (chunkLength, downloaded, total) => {
            const percent = downloaded / total;
            readline.cursorTo(process.stdout, 0);
            process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
            process.stdout.write(`(${(downloaded / 1024 / 1024).
                toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)`);
        })

        // Start download
        .pipe(fs.createWriteStream(audioPath))
        .on('finish', () => {console.log('\n[NOTICE]: FINISHED')});

        });


});
