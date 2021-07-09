import axios from "axios";

export const baseUrl = 'https://hn.algolia.com/api/v1/search';
export const dateUrl = 'https://hn.algolia.com/api/v1/search_by_date';

export async function getNews (queryArg, tagArg, forArg) {
    const currDate = new Date();
    let searchByDate='';
    let responseData;

    switch (forArg) {
        case 'all':
            break;
        case 'past24':
            currDate.setHours(currDate.getHours() - 24);
            searchByDate = `created_at_i>${Math.round(currDate.getTime()/1000)}`;
            console.log('searchByDate =>',searchByDate)
            break;
        case 'pastWeek':
            currDate.setHours(currDate.getHours() - 168);
            searchByDate = `created_at_i>${Math.round(currDate.getTime()/1000)}`;
            break;
        case 'pastMonth':
            currDate.setMonth(currDate.getMonth() - 1);
            searchByDate = `created_at_i>${Math.round(currDate.getTime()/1000)}`;
            break;
        case 'pastYear':
            currDate.setFullYear(currDate.getFullYear() - 1);
            searchByDate = `created_at_i>${Math.round(currDate.getTime()/1000)}`;
            break;
        default:
            break;
    }

    switch (forArg) {
        case 'all':
            responseData = await axios.get(baseUrl,
                {params: {query: `${queryArg}`, tags: `${tagArg}`, hitsPerPage: 50}}).then(data => data);
            break;
        default:
            responseData = await axios.get(baseUrl,
                {
                    params: {
                        query: `${queryArg}`,
                        tags: `${tagArg}`,
                        numericFilters: `${searchByDate}`,
                        hitsPerPage: 50
                    }
                }).then(data => data);
    }
    //#TODO: Begin Debug Code -- Remove
    console.log('---------------------------------------------');
    console.log('--- API Fetch responseData request object ---');
    console.log(responseData.request);
    console.log('---------------------------------------------');
    console.log('--- API Fetch responseData headers object ---');
    console.log(responseData.headers);
    console.log('---------------------------------------------');
    console.log('--- API Fetch responseData data object ---');
    console.log(responseData.data);
    console.log('---------------------------------------------');
    console.log('--- API Fetch responseData data.hits object ---');
    console.log(responseData.data.hits);
    console.log('---------------------------------------------');
    //#TODO: End Debug Code -- Remove

    return responseData;
}


export function mapTime(timestampArg) {

    const seconds = Math.floor((new Date() - timestampArg * 1000) / 1000);


    let interval = Math.floor(seconds / 31536000);

    if (interval > 1) {
        return `${interval} years`;
    }

   interval = Math.floor(seconds / 2592000);

   if (interval > 1) {
      return `${interval} months`;
    }

    interval = Math.floor(seconds / 86400);

    if (interval > 1) {
        return `${interval} days`;
   }

   interval = Math.floor(seconds / 3600);

   if (interval > 1) {
      return `${interval} hours`;
    }

    interval = Math.floor(seconds / 60);

    if (interval > 1) {
        return `${interval} minutes`;
   }

   return `${Math.floor(seconds)} seconds`;

}

export function toTimestamp(strDate){
    var datum = Date.parse(strDate);
    return datum/1000;
}
