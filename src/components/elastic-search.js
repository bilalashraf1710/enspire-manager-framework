import axios from 'axios';

export async function elasticSearch(search, config) {

    // TODO:  figure out the most efficient case-insensitive search on all terms.
    // https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-query-string-query.html
    
    if (config.appId == null || config.appId == undefined) {
        console.error('You must include an appId in the config object');
        return null;
    }
    
    var searchQuery = '';
    let searchArray = search.split(' ');
    searchArray.forEach((term, index) => {
        if (term[0] && index) searchQuery += ' AND ';
        if (term[0]) searchQuery += '((*' + term.toLowerCase() + '*) OR (*' + term[0].toUpperCase() + term.slice(1) + '*))';
    });
    if (searchQuery == '') searchQuery = '(*)';
    searchQuery += ' AND appIds:' + config.appId; // { id: 0 } for Dispatch

    try {
        const response = await axios({
            method: 'post',
            url: 'https://8ad2206de10c414fa676bbfd43d5b397.us-central1.gcp.cloud.es.io:9243/' + config.table + '/_search',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ZWxhc3RpYzplRnNYUnJMZkJvSTRsZGFNUVFYTFk1cVQ=', // The <TOKEN> is computed as base64(USERNAME:PASSWORD)
            },
            data: {
                query: {
                    query_string: {
                        query: searchQuery,
                        fields: config.fields,
                    },
                },
                sort: (config.sort) ? config.sort : [],
                size: 200,
            }
        });

        var hits = [];
        response.data.hits.hits.forEach((hit) => {
            hits.push({ ...hit._source, id: hit._id });
        });

        return hits;

    } catch (error) {
        console.log(error);
    }
}
