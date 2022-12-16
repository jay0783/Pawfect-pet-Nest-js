/**
 * @api {get} /admin/new-orders Get new orders
 * @apiGroup Admin new-orders
 * @apiName getNewOrders
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
 * @apiSuccess {Object}                                                                    response.items.customer
 * @apiSuccess {String}                                                                    response.items.customer.id
 * @apiSuccess {String}                                                                    response.items.customer.name
 * @apiSuccess {String}                                                                    response.items.customer.surname
 * @apiSuccess {String}                                                                    response.items.customer.phoneNumber
 * @apiSuccess {String}                                                                   [response.items.customer.imageUrl]
 * @apiSuccess {Object}                                                                    response.items.order
 * @apiSuccess {String}                                                                    response.items.order.id
 * @apiSuccess {String}                                                                    response.items.order.name
 * @apiSuccess {Number}                                                                    response.items.order.timeFrom
 * @apiSuccess {Number}                                                                    response.items.order.timeTo
 * @apiSuccess {String="confirmed", "pending", "canceled", "in-progress", "completed"}     response.items.order.status
 * @apiSuccess {Boolean}                                                                   response.items.order.isEmployeeChosen
 * @apiSuccess {Boolean}                                                                   response.items.order.isEmployeeAccepted
 * @apiSuccess {String}                                                                   [response.items.order.comment]
 * @apiSuccess {Object[]}                                                                  response.items.pets
 * @apiSuccess {String}                                                                    response.items.pets.id
 * @apiSuccess {String}                                                                    response.items.pets.name
 * @apiSuccess {String}                                                                    response.items.pets.breed
 * @apiSuccess {String}                                                                   [response.items.pets.imageUrl]
 */


/**
 * @api {get} /admin/new-orders/:orderId Get new order details
 * @apiGroup Admin new-orders
 * @apiName getNewOrderDetails
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 *
 * @apiParam (Params) {String}                                                             orderId
 *
 *
 * @apiSuccess {Object}                                                                    response
 * @apiSuccess {Object}                                                                    response.service
 * @apiSuccess {String}                                                                    response.service.id
 * @apiSuccess {String}                                                                    response.service.title
 * @apiSuccess {String}                                                                   [response.service.imageUrl]
 * @apiSuccess {Object}                                                                    response.order
 * @apiSuccess {String}                                                                    response.order.id
 * @apiSuccess {String}                                                                    response.order.name
 * @apiSuccess {Number}                                                                    response.order.timeFrom
 * @apiSuccess {Number}                                                                    response.order.timeTo
 * @apiSuccess {String="confirmed", "pending", "canceled", "in-progress", "completed"}     response.order.status
 * @apiSuccess {Boolean}                                                                   response.order.isEmployeeChosen
 * @apiSuccess {Boolean}                                                                   response.order.isEmployeeAccepted
 * @apiSuccess {String}                                                                   [response.order.comment]
 * @apiSuccess {Object[]}                                                                  response.pets
 * @apiSuccess {String}                                                                    response.pets.id
 * @apiSuccess {String}                                                                    response.pets.name
 * @apiSuccess {String}                                                                    response.pets.breed
 * @apiSuccess {String}                                                                   [response.pets.imageUrl]
 *
 */


/**
 * @api {get} /admin/new-orders/:orderId Cancel(Deny) new-order
 * @apiGroup Admin new-orders
 * @apiName cancelNewOrder
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