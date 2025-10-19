import AWS from 'aws-sdk';
import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpEventNormalizer from '@middy/http-event-normalizer'; 
import createError from 'http-errors';


const dynamoDB = new AWS.DynamoDB.DocumentClient();

export async function getAuctionByID(id) {
  let auction;

  try {
    const result = await dynamoDB.get({
      TableName: process.env.AUCTIONS_TABLE_NAME,
      Key: { id },
    }).promise();

    auction = result.Item;
  } catch (error) {
    console.error(error);
    throw new createError.InternalServerError(error);
  }

  if (!auction) {
    throw new createError.NotFound(`Auction with ID "${id}" not found`);
  }

  return auction;
}

async function getAuction(event, context) {

  const { id } = event.pathParameters;

  const auction = await getAuctionByID(id);
  
  return {
    statusCode: 200,
    body: JSON.stringify(auction),
  };
}

export const handler = middy(getAuction)
  .use(httpEventNormalizer())
  .use(httpErrorHandler());
