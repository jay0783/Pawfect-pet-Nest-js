/**
 * @api {get} /admin/time-offs Get employee time-offs
 * @apiGroup Admin employee time-offs
 * @apiName getTimeOffs
 * @apiDescription Get employee time-offs
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Query) {Number}                                     [limit=10]
 * @apiParam (Query) {Number}                                     [page=1]
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Object[]}                                         response.items
 * @apiSuccess {String}                                           response.items.id
 * @apiSuccess {String}                                           response.items.name
 * @apiSuccess {String}                                           response.items.surname
 * @apiSuccess {String}                                           [response.items.imageUrl]
 * @apiSuccess {Number}                                           response.items.startedDate
 * @apiSuccess {Number}                                           response.items.endedDate
 * @apiSuccess {Object}                                           response.meta
 * @apiSuccess {Number}                                           response.meta.itemCount
 * @apiSuccess {Number}                                           response.meta.totalItems
 * @apiSuccess {Number}                                           response.meta.itemsPerPage
 * @apiSuccess {Number}                                           response.meta.totalPages
 * @apiSuccess {Number}                                           response.meta.currentPage
 */


/**
 * @api {get} /admin/time-offs/:timeOffId Get employee time-off details
 * @apiGroup Admin employee time-offs
 * @apiName getTimeOffDetails
 * @apiDescription Get time-off details
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                                    timeOffId
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {String}                                           response.id
 * @apiSuccess {Number}                                           response.startedDate
 * @apiSuccess {Number}                                           response.endedDate
 * @apiSuccess {String="sick", "business-trip", "other"}          response.timeOffType
 * @apiSuccess {String}                                           [response.comment]
 * @apiSuccess {String}                                           response.employee.id
 * @apiSuccess {String}                                           response.employee.name
 * @apiSuccess {String}                                           response.employee.surname
 * @apiSuccess {String}                                           [response.employee.imageUrl]
 */


/**
 * @api {post} /admin/time-offs/:timeOffId/accept Accept employee time-off
 * @apiGroup Admin employee time-offs
 * @apiName acceptTimeOff
 * @apiDescription Accept employee time-off
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}              timeOffId
 *
 * @apiSuccess {Object}                     response
 * @apiSuccess {Boolean=true}               response.success
 *
 */


/**
 * @api {post} /admin/time-offs/:timeOffId/decline Decline employee time-off
 * @apiGroup Admin employee time-offs
 * @apiName declineTimeOff
 * @apiDescription Decline employee time-off
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}              timeOffId
 *
 * @apiSuccess {Object}                     response
 * @apiSuccess {Boolean=true}               response.success
 *
 */
