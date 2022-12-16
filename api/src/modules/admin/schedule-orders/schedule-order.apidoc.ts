/**
 * @apiGroup Admin Schedule orders
 * @api {get} /admin/schedule-orders/:orderId Get confirmed order details
 * @apiName getConfirmedOrderDetails
 *
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                    orderId
 *
 *
 * @apiSuccess {Object}                                           response
 * @apiSuccess {Object[]}                                         response.pets
 * @apiSuccess {String}                                           response.pets.id
 * @apiSuccess {String}                                           response.pets.name
 * @apiSuccess {String}                                           response.pets.breed
 * @apiSuccess {String}                                          [response.pets.imageUrl]
 *
 * @apiSuccess {Object}                                           response.order
 * @apiSuccess {String}                                           response.order.id
 * @apiSuccess {Number}                                           response.order.dateFrom     timestamp
 * @apiSuccess {Number}                                           response.order.dateTo       timestamp
 * @apiSuccess {String}                                           response.order.address
 *
 * @apiSuccess {Object}                                           response.service
 * @apiSuccess {String}                                           response.service.id
 * @apiSuccess {String}                                           response.service.title
 * @apiSuccess {String}                                          [response.service.imageUrl]
 *
 * @apiSuccess {Object}                                           response.employee
 * @apiSuccess {String}                                           response.employee.id
 * @apiSuccess {String}                                           response.employee.name
 * @apiSuccess {String}                                           response.employee.surname
 * @apiSuccess {String}                                          [response.employee.imageUrl]
 */


/**
 * @apiGroup Admin Schedule orders
 * @api {get} /admin/schedule-orders/:orderId Get confirmed order details
 * @apiName getConfirmedOrderDetails
 *
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * 
 * @apiSuccess {Object}                                          response
 * @apiSuccess {Number}                                          response.date                key:value variable. key - in millis timestamp
 * 
 */