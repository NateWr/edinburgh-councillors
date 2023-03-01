import fs from 'fs';
import http from 'http';
import https from 'https';
import sharp from 'sharp';

/**
 * Downloads file from remote HTTP[S] host and puts its contents to the
 * specified location.
 */
async function download(url, filePath) {
  const proto = !url.charAt(4).localeCompare('s') ? https : http;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    let fileInfo = null;

    const request = proto.get(url, response => {
      if (response.statusCode !== 200) {
        fs.unlink(filePath, () => {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        });
        return;
      }

      fileInfo = {
        mime: response.headers['content-type'],
        size: parseInt(response.headers['content-length'], 10),
      };

      response.pipe(file);
    });

    // The destination stream is ended by the time it's called
    file.on('finish', () => resolve(fileInfo));

    request.on('error', err => {
      fs.unlink(filePath, () => reject(err));
    });

    file.on('error', err => {
      fs.unlink(filePath, () => reject(err));
    });

    request.end();
  });
}

let wards = JSON.parse(
    fs.readFileSync('./public/councillors.json')
);

wards.forEach(ward => {
  ward.councillors.forEach(councillor => {
    const url = councillor.photo;
    const filename = councillor.name.replace(/[^a-z0-9]/gi, '-').toLowerCase() + '.jpg';
    councillor.photo = '/images/' + filename;
    download(url, './src/photos/'  + filename)
      .then(() => {
        const image = sharp('./src/photos/' + filename);
        image
          .metadata()
          .then(function(metadata) {
            const size = Math.min(metadata.width, metadata.height);
            return image.resize({
              width: size,
              height: size,
              fit: 'cover'
            })
            .toFile('./public/images/' + filename);
          });
      })
  })
});

fs.writeFileSync('public/councillors.json', JSON.stringify(wards));
