/**
 * @api {get} /employee/ratings/my Get my ratings
 * @apiGroup Employee ratings
 * @apiName getMyRatings
 * @apiDescription Get my rating information
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Query) {Number}                                     [limit=10]
 * @apiParam (Query) {Number}                                     [page=1]
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Number}                                           response.myRating
 *
 * @apiSuccess {Object[]}                                         response.items
 * @apiSuccess {String}                                           response.items.id
 * @apiSuccess {String}                                           response.items.name
 * @apiSuccess {String}                                           response.items.surname
 * @apiSuccess {Number}                                           response.items.rate
 * @apiSuccess {String}                                           response.items.comment
 *
 * @apiSuccess {Object}                                           response.meta
 * @apiSuccess {Number}                                           response.meta.itemCount
 * @apiSuccess {Number}                                           response.meta.totalItems
 * @apiSuccess {Number}                                           response.meta.itemsPerPage
 * @apiSuccess {Number}                                           response.meta.totalPages
 * @apiSuccess {Number}                                           response.meta.currentPage
 */


/**
 * @api {get} /employee/ratings/my/total Get my total rating
 * @apiGroup Employee ratings
 * @apiName getMyTotalRating
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Number}                                           response.totalRating
 *
 */