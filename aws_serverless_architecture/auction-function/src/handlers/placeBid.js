import AWS from 'aws-sdk';
import validator from '@middy/validator';
import commonMiddleware from '../lib/commonMiddleware.js';
import { getAuctionByID } from './getAuction';
import createError from 'http-errors';
import placeBidSchema from '../lib/schemas/placeBidSchema';


const dynamoDB = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {

  const { id } = event.pathParameters;
  const { amount } = event.body;

  const auction = await getAuctionByID(id);

  if ( amount <= auction.highestBid.amount ) {
    throw new createError.BadRequest(`Your bid must be higher than ${auction.highestBid.amount}`);
  }

  const params = {
    TableName: process.env.AUCTIONS_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set highestBid.amount = :amount',
    ExpressionAttributeValues: {
      ':amount': amount,
    },
    ReturnValues: 'ALL_NEW',
  };

  let updatedAuction;

  try {
    const result = await dynamoDB.update(params).promise();
    updatedAuction = result.Attributes;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  
  return {
    statusCode: 200,
    body: JSON.stringify(updatedAuction),
  };
}

export const handler = commonMiddleware(placeBid)
  .use(validator({ inputSchema: placeBidSchema }));