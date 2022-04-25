import axios from "axios";
import { parseString } from 'xml2js';
import createError from "http-errors";

const apiEndpoint = "http://restapi.adequateshop.com/api/Traveler";

async function getJsonData(page) {
    let jsondata, result;
    try {
        result = await axios.get(apiEndpoint + `?page=${page}`);
    } catch (error) {
        console.log(error);
        throw new createError.InternalServerError("Something went wrong while requesting xml data");
    }

    parseString(result.data, { explicitArray: false }, function (err, result) {
        if (err) {
            console.log(err);
            throw new createError.InternalServerError("Something went wrong while parsing xml to json");
        }
        jsondata = result;
    });
    return jsondata;
}

export async function collectFullData() {
    let fullData = [];
    let resultdata = await getJsonData(1);
    let totalPages = parseInt(resultdata.TravelerinformationResponse.total_pages);
    console.log("here", totalPages);
    for (let i = 1; i <= totalPages; i++) {
        console.log("collecting data page: ", i);
        try {
            let pageData = await getJsonData(i);
            // console.log(pageData.TravelerinformationResponse.travelers.Travelerinformation);
            fullData = [...fullData, ...pageData.TravelerinformationResponse.travelers.Travelerinformation];
        } catch (error) {
            console.log(error);
        }
    }
    console.log("All pages data retrieved.");

    return { "travelers": fullData };
}