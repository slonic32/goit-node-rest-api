import HttpError from "../helpers/HttpError.js";
import Jimp from "jimp";
import path from "path";

export async function resizeImg(file) {
  try {
    const img = await Jimp.read(file.path);
    await img.resize(250, 250);
    await img.write(path.join("public", "avatars", file.filename));
    return path.join("public", "avatars", file.filename);
  } catch (error) {
    console.log("resize error");
    throw HttpError(500);
  }
}
