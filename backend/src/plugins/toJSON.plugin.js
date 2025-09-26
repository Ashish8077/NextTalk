export function toJSONPlugin(schema) {
  schema.virtual("id").get(function () {
    return this._id.toHexString();
  });
  schema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transfrom: (doc, ret) => {
      delete ret._id;
      delete ret.password;
      return ret;
    },
  });
}
