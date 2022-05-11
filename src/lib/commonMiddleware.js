import middy from "@middy/core";
import httperrorhandler from "@middy/http-error-handler";
import httpeventnormalizer from "@middy/http-event-normalizer";
import httpjsonbodyparser from "@middy/http-json-body-parser";

export default (handler) =>
  middy(handler).use([
    httpjsonbodyparser(),
    httperrorhandler(),
    httpeventnormalizer(),
  ]);
