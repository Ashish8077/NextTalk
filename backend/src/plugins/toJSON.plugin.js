export function toJSONPlugin(schema) {
  schema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.password;
      delete ret.verificationToken;
      delete ret.verificationTokenExpiry;
      return ret;
    },
  });
}
