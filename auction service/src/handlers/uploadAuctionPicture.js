import {getAuction} from '../lib/getAuction';
import { uploadPictureToS3 } from '../lib/uploadPictureToS3';
import createError from "http-errors";
import commonMiddleware from '../lib/commonMiddleware';
import { validateBase64Pic } from '../lib/validatePicBase64';
import { setAuctionPictureUrl } from '../lib/setAuctionPictureUrl';

export async function uploadAuctionPicture(event) {
  const { id } = event.path;
  const {picBase64} = event.body;
  const {email}=event.cognitoPoolClaims;


  const auction = await getAuction(id);

  if (auction.seller !== email) {
    throw new createError.Forbidden(`You are not the seller of this auction!`);
  }

  const contentType = validateBase64Pic(picBase64);

  const base64 = picBase64.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  let updatedAuction;

  try {
    const pictureUrl = await uploadPictureToS3(auction.id, buffer,contentType);
    updatedAuction = await setAuctionPictureUrl(auction.id, pictureUrl);

  } catch (error) {
    throw new createError.InternalServerError();
  }
  
  return updatedAuction;
}

export const handler = commonMiddleware(uploadAuctionPicture);