/**
 * @api {put} /admin/zip-codes Add zip-code
 * @apiGroup Admin zip-codes
 * @apiName addZipCode
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Body) {String}                code
 *
 * @apiSuccess {Object}                     response
 * @apiSuccess {String}                     response.id
 * @apiSuccess {String}                     response.code
 *
 */


/**
 * @api {get} /admin/zip-codes Get all zip-codes
 * @apiGroup Admin zip-codes
 * @apiName getAllZipCodes
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Object}                     response
 * @apiSuccess {Object[]}                   response.items
 * @apiSuccess {String}                     response.items.id
 * @apiSuccess {String}                     response.items.code
 *
 */


/**
 * @api {delete} /admin/zip-codes/:zipCodeId Delete zip-code
 * @apiGroup Admin zip-codes
 * @apiName deleteZipCode
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}              zipCodeId
 *
 * @apiSuccess {Object}                     response
 * @apiSuccess {Boolean=true}               response.success
 *
 */
