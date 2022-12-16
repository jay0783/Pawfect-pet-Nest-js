/**
 * @apiGroup Customer Holidays
 * @api {get} /customer/holidays/range Get holidays by date range
 * @apiName getHolidaysByDateRange
 * @apiDescription Route for getting holidays on create order flow
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Query) {String} dateFrom
 * @apiParam (Query) {String} dateTo
 *
 * @apiSuccess {Object}   response
 * @apiSuccess {Object[]} response.items
 * @apiSuccess {Number}   response.items.day
 * @apiSuccess {Number}   response.items.month
 * @apiSuccess {Number}   response.items.feeAmount
 */
