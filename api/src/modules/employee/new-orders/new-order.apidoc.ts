/**
 * @apiGroup Employee New-orders
 * @api {get} /employee/new-orders Get new orders
 * @apiName getNewOrders
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Query) {Number}                                                                [limit=10]
 * @apiParam (Query) {Number}                                                                [page=1]
 *
 *
 * @apiSuccess {Object}                                                                       response
 * @apiSuccess {Object[]}                                                                     response.items
 * @apiSuccess {String}                                                                       response.items.id
 * @apiSuccess {String="confirmed", "pending", "canceled", "in-progress", "completed"}        response.items.status
 * @apiSuccess {Number}                                                                       response.items.timeFrom
 * @apiSuccess {Number}                                                                       response.items.timeTo
 *
 * @apiSuccess {Object[]}                                                                     response.items.pets
 * @apiSuccess {String}                                                                       response.items.pets.id
 * @apiSuccess {String}                                                                       response.items.pets.name
 * @apiSuccess {String}                                                                       response.items.pets.breed
 * @apiSuccess {String}                                                                      [response.items.pets.imageUrl]
 *
 * @apiSuccess {Object}                                                                       response.items.service
 * @apiSuccess {String}                                                                       response.items.service.id
 * @apiSuccess {String}                                                                       response.items.service.title
 * @apiSuccess {String}                                                                      [response.items.service.imageUrl]
 *
 * @apiSuccess {Object}                                                                       response.meta
 * @apiSuccess {Number}                                                                       response.meta.itemCount
 * @apiSuccess {Number}                                                                       response.meta.totalItems
 * @apiSuccess {Number}                                                                       response.meta.itemsPerPage
 * @apiSuccess {Number}                                                                       response.meta.totalPages
 * @apiSuccess {Number}                                                                       response.meta.currentPage
 *
 */


/**
 * @apiGroup Employee New-orders
 * @api {get} /employee/new-orders/:orderId New order details
 * @apiName getNewOrderDetails
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                                                                orderId
 *
 *
 * @apiSuccess {Object}                                                                       response
 * @apiSuccess {String}                                                                       response.id
 * @apiSuccess {Boolean}                                                                      response.isFirstMeeting
 * @apiSuccess {String="confirmed", "pending", "canceled", "in-progress", "completed"}        response.status
 * @apiSuccess {Number}                                                                       response.timeFrom
 * @apiSuccess {Number}                                                                       response.timeTo
 * 
 * @apiSuccess {Object}                                                                       response.customer
 * @apiSuccess {String}                                                                       response.customer.id
 * @apiSuccess {String}                                                                       response.customer.name
 * @apiSuccess {String}                                                                       response.customer.surname
 * @apiSuccess {String}                                                                       response.customer.homeAddress
 * @apiSuccess {String}                                                                      [response.customer.imageUrl]
 * 
 * @apiSuccess {Object[]}                                                                     response.pets
 * @apiSuccess {String}                                                                       response.pets.id
 * @apiSuccess {String}                                                                       response.pets.name
 * @apiSuccess {String}                                                                       response.pets.breed
 * @apiSuccess {String}                                                                      [response.pets.imageUrl]
 * 
 * @apiSuccess {Object}                                                                       response.service
 * @apiSuccess {String}                                                                       response.service.id
 * @apiSuccess {String}                                                                       response.service.title
 * @apiSuccess {String}                                                                      [response.service.imageUrl]
 * 
 */


/**
 * @apiGroup Employee New-orders
 * @api {post} /employee/new-orders/:orderId/accept Accept new order
 * @apiName acceptNewOrder
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                                                                orderId
 *
 *
 * @apiSuccess {Object}                                                                       response
 * @apiSuccess {Boolean=true}                                                                 response.success
 * 
 */


/**
 * @apiGroup Employee New-orders
 * @api {post} /employee/new-orders/:orderId/cancel Cancel new order
 * @apiName cancelNewOrder
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                                                                orderId
 *
 *
 * @apiSuccess {Object}                                                                       response
 * @apiSuccess {Boolean=true}                                                                 response.success
 * 
 */