/**
 * @api {put} /employee/time-offs Add time-off
 * @apiGroup Employee time-offs
 * @apiName addTimeOff
 * @apiDescription Create time-off
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Body) {String="range", "separated"}                 dateChoiceType
 * @apiParam (Body) {String="sick", "business-trip", "other"}     timeOffType
 * @apiParam (Body) {Number[]}                                    dates
 * @apiParam (Body) {string{..200}}                              [notes]
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Boolean=true}                                     response.success
 */


/**
 * @api {patch} /employee/time-offs/:timeOffId Edit time-off
 * @apiGroup Employee time-offs
 * @apiName editTimeOff
 * @apiDescription Edit time-off
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Body) {String="range", "separated"}                 dateChoiceType
 * @apiParam (Body) {String="sick", "business-trip", "other"}     timeOffType
 * @apiParam (Body) {Number[]}                                    dates
 * @apiParam (Body) {string{..200}}                               notes
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Boolean=true}                                     response.success
 */


/**
 * @api {get} /employee/time-offs Get time-offs
 * @apiGroup Employee time-offs
 * @apiName getTimeOffs
 * @apiDescription Get all time-offs
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Query) {Number}                             [limit=10]
 * @apiParam (Query) {Number}                             [page=1]
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Object[]}                                         response.items
 * @apiSuccess {String}                                           response.items.id
 * @apiSuccess {String="range", "separated"}                      response.items.dateChoiceType
 * @apiSuccess {String="sick", "business-trip", "other"}          response.items.timeOffType
 * @apiSuccess {Number[]}                                         response.items.dates
 * @apiSuccess {String}                                           response.items.notes
 * @apiSuccess {String="approved", "decline", "waiting"}          response.items.status
 * 
 * @apiSuccess {Object}                                   response.meta
 * @apiSuccess {Number}                                   response.meta.itemCount
 * @apiSuccess {Number}                                   response.meta.totalItems
 * @apiSuccess {Number}                                   response.meta.itemsPerPage
 * @apiSuccess {Number}                                   response.meta.totalPages
 * @apiSuccess {Number}                                   response.meta.currentPage
 */
