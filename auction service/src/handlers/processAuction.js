import { getEndedAuctions } from "../lib/getEndedAuctions";
import {closeAuction} from "../lib/closeAuction";
import createError from "http-errors";


async function processAuction(event, context) {
  try {
    const auctionsToClose = await getEndedAuctions();
    const closePromises= auctionsToClose.map(a => closeAuction(a));
    await Promise.all(closePromises);
    return {closed:closePromises.length};
  } catch (error) {
    console.log(error);
    throw new createError.InternalServerError();
  }

}

export const handler = processAuction;
