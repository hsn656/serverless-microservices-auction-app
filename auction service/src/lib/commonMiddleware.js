import middy from "@middy/core";
import httperrorhandler from "@middy/http-error-handler";
import httpeventnormalizer from "@middy/http-event-normalizer";

export default (handler) =>
  middy(handler).use([
    httperrorhandler(),
    httpeventnormalizer(),
  ]);
