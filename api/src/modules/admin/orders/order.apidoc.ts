/**
 * @api {get} /admin/orders/:orderId/employee/:employeeId Set employee to order
 * @apiGroup Admin orders
 * @apiName setEmployeeToOrder
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                    orderId
 * @apiParam (Params) {String}                                    employeeId
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Boolean=true}                                     response.success
 */


/**
 * @api {post} /admin/orders/:orderId/cancel Cancel order
 * @apiGroup Admin orders
 * @apiName cancelOrder
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                                             orderId
 *
 * @apiParam (Body) {String}                                                              [reason]
 *
 *
 * @apiSuccess {Object}                                                                    response
 * @apiSuccess {Boolean=true}                                                              response.success
 *
 */


/**
 * @api {post} /admin/orders/:orderId/date/change Change order date
 * @apiGroup Admin orders
 * @apiName changeDate
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                                             orderId
 *
 * @apiParam (Body) {Number}                                                               date
 * @apiParam (Body) {Number}                                                               time
 *
 *
 * @apiSuccess {Object}                                                                    response
 * @apiSuccess {Boolean=true}                                                              response.success
 *
 */