const fs = require('fs');
const path = require('path');
const https = require('https');
const axios = require('axios');

const postTXT = fs.readFileSync(path.join(__dirname, 'DATA/post.txt'), 'utf8');
const posts = postTXT.split('\n\n')
posts.forEach((post, i) => {
    const url = post.split('\n')[1].replace('Link: ', '');
    if (url == 'N/A') return;
    const dest = './vids';
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest);
    }

    const filename = post.split('\n')[0].replace('Date: ', '').replaceAll(":", ".")

    // Make a request to download the file
    // console.log(url);
    https.get(url, (res) => {
        if (res.statusCode !== 200) {
            const urls = url.split(" ")
            fs.mkdir("vids/" + filename, { recursive: true }, (err) => {
                if (err) throw err;
            });
            urls.forEach((urll) => {
                console.log(urll)
                axios.get(urll, { responseType: 'stream' }).then((response) => {
                    response.data.pipe(fs.createWriteStream(`vids/${filename}/${Math.random()}.png`));
                }).catch((err) => {
                    console.error(`Error downloading ${filename}: ${err}`);
                })

                // https.get(urll, (res) => {
                //     console.log(res);
                //     const file = fs.createWriteStream(`vids/${filename}/${i}.mp4`);
                //     res.pipe(file);

                //     file.on('finish', () => {
                //         file.close();
                //         console.log(`${i} Downloaded ${filename} to ${dest}`);
                //     });
                // });
            })
            x = 0; 
            return;
        }
        // const file = fs.createWriteStream(`${dest}/${filename}.mp4`);
        // res.pipe(file);
        // file.on('finish', () => {
        //     file.close();
        //     console.log(`Downloaded ${filename} to ${dest}`);
        // });
    }).on('error', (err) => {
        console.error(`Error downloading ${filename}: ${err}`);
        fs.unlinkSync(`${dest}/${filename}`);
    });
});