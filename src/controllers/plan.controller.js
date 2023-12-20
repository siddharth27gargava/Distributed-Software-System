const status = require('http-status');
const {
    ifKeyExists,
    getETag
} = require("../services/redis.service");
const config = require("../../config/local.json");
const {
    isValidJSONSchema
} = require('../services/jsonSchema.service');

const PLAN_SCHEMA = require("../models/plan.model");
const {
    createSavePlan,
    getSavedPlan,
    deleteSavedPlan,
    generateETag
} = require('../services/plan.service');

const getPlan = async (req, res) => {
    console.log("Executing the GET method.");
    try {
        const {
            objectId
        } = req.params;

        // create key in the format - <type>_<objectId>
        const KEY = `${config.PLAN_TYPE}_${objectId}`;

        // Check if the KEY is present in the database(redis)
        const isKeyValid = await ifKeyExists(KEY);
        console.log(`Key to deal with: ${KEY}`);

        // check for valid objectId
        if (!isKeyValid) {
            console.log(`${KEY}: not valid!`)
            return res.status(status.NOT_FOUND).send({
                message: `Invalid ObjectId! - ${objectId}`,
                value: objectId,
                type: "Invalid"
            });
        }

        const eTag = await getETag(KEY);

        const urlETag = req.headers['If-None-Match'];
        if (!!urlETag && urlETag.equals(eTag)) {
            console.log(`${eTag}: ETag present.`);
            res.setHeader('ETag', eTag);
            return res.status(status.NOT_MODIFIED);
        }
        console.log("Saving Plan...");
        const plan = await getSavedPlan(KEY);
        console.log("Saved successfully!!")
        res.setHeader('ETag', eTag);
        return res.status(status.OK).send(plan);
    } catch (error) {
        return res.status(status.UNAUTHORIZED).send({
            message: "Bad Request or Unauthorised"
        });
    }
}

const createPlan = async (req, res) => {
    console.log("Executing the POST method.");
    try {
        const planJSON = req.body;
        if (!!!planJSON) {
            return res.status(status.BAD_REQUEST).send({
                message: "Invalid body!",
                type: "Invalid"
            });
        }

        console.log("Validating JSON body")
        const isValidSchema = await isValidJSONSchema(planJSON, PLAN_SCHEMA);

        if (isValidSchema?.error) {
            console.log("Invalid JSON");
            return res.status(status.BAD_REQUEST).send({
                message: "Invalid Schema!",
                type: "Invalid",
                ...isValidSchema?.data
            })
        }

        console.log("Valid JSON");
        const KEY = `${config.PLAN_TYPE}_${planJSON.objectId}`;


        console.log(`Checking for ${KEY} validation!`)
        const isKeyValid = await ifKeyExists(KEY);
        if (isKeyValid) {
            console.log(`${KEY}: not valid!`)
            return res.status(status.CONFLICT).send({
                message: `Plan already exist! - ${planJSON.objectId}`,
                type: "Already Exists"
            });
        }
        console.log("Creating plan..")
        await createSavePlan(KEY, planJSON);
        console.log("Plan created");
        const eTag = generateETag(KEY, planJSON);
        console.log("etag generated");
        console.log(`${planJSON.objectId}: Plan created successfully!`);

        res.setHeader('ETag', eTag);

        return res.status(status.OK).send({
            message: "Plan created successfully",
            objectId: planJSON.objectId
        })
    } catch (error) {
        return res.status(status.UNAUTHORIZED).send({
            message: "Bad Request or Unauthorised"
        });
    }
}

const deletePlan = async (req, res) => {
    try {
        const {
            objectId
        } = req.params;
        console.log("Executing the DELETE method.")

        // create key in the format - <type>_<objectId>
        const KEY = `${config.PLAN_TYPE}_${objectId}`;

        console.log(`Key to deal with: ${KEY}`);

        // Check if the KEY is present in the database(redis)
        const isKeyValid = await ifKeyExists(KEY);

        // check for valid objectId
        if (!isKeyValid) {
            console.log(`${KEY}: not valid!`)
            return res.status(status.NOT_FOUND).send({
                message: `Invalid ObjectId! - ${objectId}`,
                value: objectId,
                type: "Invalid"
            });
        }

        // Retrieve the eTag
        // const eTag = await getETag(KEY);

        // // Check the If-Match header against the eTag
        // const requestETag = req.headers['if-match'];
        // // console.log("HEADERS", req.headers);
        // // console.log("ETAG", requestETag);
        // // console.log("etag", eTag);
        // if (requestETag && requestETag !== eTag) {
        //     //console.log(eTag);
        //     //console.log("ETag mismatch.");
        //     return res.status(412).send({  // 412 Precondition Failed
        //         message: "ETag precondition failed."
        //     });
        // }

        console.log("Deleting plan...");
        await deleteSavedPlan(KEY);
        console.log("Plan Deleted successfully!!");

        return res.status(status.OK).send({
            message: "Plan deleted successfully",
            objectId
        })
    } catch (error) {
        console.error("Error encountered:", error);
        return res.status(status.UNAUTHORIZED).send({
            message: "Bad Request or Unauthorised"
        });
    }
}

module.exports = {
    getPlan,
    createPlan,
    deletePlan
}