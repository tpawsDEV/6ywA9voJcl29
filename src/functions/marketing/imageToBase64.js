import { getImage } from "./index";

function base64ToBrowser(buffer) {
  return window.btoa(
    [].slice
      .call(new Uint8Array(buffer))
      .map(function (bin) {
        return String.fromCharCode(bin);
      })
      .join("")
  );
}

async function imageToBase64Browser(urlOrImage, param) {
  if (!("fetch" in window && "Promise" in window)) {
    return Promise.reject(
      "[*] image-to-base64 is not compatible with your browser."
    );
  }
  const t = await getImage(
    urlOrImage.replace(
      "https://s3-sa-east-1.amazonaws.com/app.glutoes.com/",
      ""
    )
  );

  const a = await base64ToBrowser(t.data.data);
  return a
}

export { imageToBase64Browser };
