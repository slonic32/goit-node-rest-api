import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const userSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ["starter", "pro", "business"],
      default: "starter",
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: String,
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
  },
  { versionKey: false }
);

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    const emailHash = crypto.createHash("md5").update(this.email).digest("hex");
    this.avatarURL = `https://gravatar.com/avatar/${emailHash}.jpg?d=retro`;
  }

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, +process.env.bcryptSalt);
  }

  next();
});

userSchema.methods.checkPassword = async function (password) {
  const result = await bcrypt.compare(password, this.password);
  return result;
};

export const UserModel = model("users", userSchema);
