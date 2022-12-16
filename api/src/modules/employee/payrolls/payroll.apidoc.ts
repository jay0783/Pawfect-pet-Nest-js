/**
 * @api {get} /employee/payrolls/my Get my payrolls
 * @apiGroup Employee payrolls
 * @apiName getMyPayrolls
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Object[]}                                         response.items
 * @apiSuccess {String}                                           response.items.title
 * @apiSuccess {Number}                                           response.items.date
 * @apiSuccess {Number}                                           response.items.amount
 *
 * @apiSuccess {Number}                                           response.amountEarned
 *
 * @apiSuccess {Object}                                           response.meta
 * @apiSuccess {Number}                                           response.meta.itemCount
 * @apiSuccess {Number}                                           response.meta.totalItems
 * @apiSuccess {Number}                                           response.meta.itemsPerPage
 * @apiSuccess {Number}                                           response.meta.totalPages
 * @apiSuccess {Number}                                           response.meta.currentPage
 *
 */


/**
 * @api {get} /employee/payrolls/my/total Get my total payrolls
 * @apiGroup Employee payrolls
 * @apiName getMyTotalPayrolls
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Number}                                           response.amountEarned
 *
 */
