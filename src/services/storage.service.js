const ImageKit = require('@imagekit/nodejs');

const imageKitClient = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
})

async function uploadImage(file) {
    const result = await imageKitClient.files.upload({
        file,
        fileName: "product_" + Date.now(),
        folder: "/product",
    });
    console.log("result", result);
   return result
};

module.exports = { uploadImage };