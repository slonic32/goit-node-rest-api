import HttpError from "../helpers/HttpError.js";
import Jimp from "jimp";
import path from "path";
import * as fse from "fs-extra";

const fullPath = path.join("public", "avatars");

export async function resizeImg(file) {
  try {
    const img = await Jimp.read(file.path);
    await img.resize(250, 250);
    await fse.ensureDir(fullPath);
    await img.write(path.join(fullPath, file.filename));
    return path.join(fullPath, file.filename);
  } catch (error) {
    console.log("resize error");
    throw HttpError(500);
  }
}
