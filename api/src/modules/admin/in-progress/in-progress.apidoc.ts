/**
 * @api {get} /admin/in-progress Get in-progress orders
 * @apiGroup Admin in-progress
 * @apiName getInProgressOrders
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Query) {Number}                                                             [limit=10]
 * @apiParam (Query) {Number}                                                             [page=1]
 *
 *
 * @apiSuccess {Object}                                                                    response
 * @apiSuccess {Object[]}                                                                  response.items
 * @apiSuccess {Object}                                                                   [response.items.employee]
 * @apiSuccess {String}                                                                    response.items.employee.id
 * @apiSuccess {String}                                                                    response.items.employee.name
 * @apiSuccess {String}                                                                    response.items.employee.surname
 * @apiSuccess {Number}                                                                    response.items.employee.rating
 * @apiSuccess {String}                                                                   [response.items.employee.imageUrl]
 * @apiSuccess {Object}                                                                    response.items.order
 * @apiSuccess {String}                                                                    response.items.order.id
 * @apiSuccess {String}                                                                    response.items.order.name
 * @apiSuccess {Number}                                                                    response.items.order.timeFrom
 * @apiSuccess {Number}                                                                    response.items.order.timeTo
 * @apiSuccess {String="confirmed", "pending", "canceled", "in-progress", "completed"}     response.items.order.status
 * @apiSuccess {Object[]}                                                                  response.items.pets
 * @apiSuccess {String}                                                                    response.items.pets.id
 * @apiSuccess {String}                                                                    response.items.pets.name
 * @apiSuccess {String}                                                                    response.items.pets.breed
 * @apiSuccess {String}                                                                   [response.items.pets.imageUrl]
 *
 */


/**
 * @api {get} /admin/in-progress/:orderId Get in-progress order details
 * @apiGroup Admin in-progress
 * @apiName getInProgressOrderDetails
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                                             orderId
 *
 *
 * @apiSuccess {Object}                                                                    response
 * @apiSuccess {Object}                                                                   [response.employee]
 * @apiSuccess {String}                                                                    response.employee.id
 * @apiSuccess {String}                                                                    response.employee.name
 * @apiSuccess {String}                                                                    response.employee.surname
 * @apiSuccess {Number}                                                                    response.employee.rating
 * @apiSuccess {String}                                                                   [response.employee.imageUrl]
 * 
 * @apiSuccess {Object}                                                                    response.checklist
 * @apiSuccess {String}                                                                    response.checklist.id
 * @apiSuccess {String}                                                                    response.checklist.name
 * @apiSuccess {Number}                                                                    response.checklist.numOrder
 * @apiSuccess {Number}                                                                    response.checklist.dateStart
 * @apiSuccess {Number}                                                                    response.checklist.dateEnd
 * @apiSuccess {String}                                                                   [response.checklist.imageUrl]
 * @apiSuccess {String[]}                                                                  response.checklist.attachmentUrls
 * 
 * @apiSuccess {Object[]}                                                                  response.checklist.actions
 * @apiSuccess {String}                                                                    response.checklist.actions.name
 * @apiSuccess {Number}                                                                    response.checklist.actions.time
 * 
 * @apiSuccess {Object[]}                                                                  response.pets
 * @apiSuccess {String}                                                                    response.pets.id
 * @apiSuccess {String}                                                                    response.pets.name
 * @apiSuccess {String}                                                                    response.pets.breed
 * @apiSuccess {String}                                                                   [response.pets.imageUrl]
 *
 */