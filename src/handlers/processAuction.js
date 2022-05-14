import { getEndedAuctions } from "../lib/getEndedAuctions";

async function processAuction(event, context) {
  const auctionsToClose = await getEndedAuctions();
  console.log(auctionsToClose);
}

export const handler = processAuction;
