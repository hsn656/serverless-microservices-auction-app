import createError from "http-errors";

export function validateBase64Pic(base64){
  try {
      const contentType= base64.split(":")[1].split(";")[0];
      if(!contentType.startsWith("image"))
      {
          throw new createError.BadRequest("invalid content type")
      }
      return contentType;

    } catch (error) {
      throw new createError.BadRequest("invalid content type")
    }
}