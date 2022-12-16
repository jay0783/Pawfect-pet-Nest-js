/**
 * @apiGroup Employee confirmed orders
 * @api {get} /employee/confirmed Get confirmed orders
 * @apiName getConfirmedOrders
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Query) {Number}                                                                date                           millisecond timestamp
 * @apiParam (Query) {Number}                                                                [limit=10]
 * @apiParam (Query) {Number}                                                                [page=1]
 *
 *
 * @apiSuccess {Object}                                                                       response
 * @apiSuccess {Object[]}                                                                     response.items
 * @apiSuccess {String}                                                                       response.items.id
 * @apiSuccess {String="confirmed", "pending", "canceled", "in-progress", "completed"}        response.items.status
 * @apiSuccess {Number}                                                                       response.items.dateFrom
 * @apiSuccess {Number}                                                                       response.items.dateTo
 * @apiSuccess {Boolean}                                                                      response.items.isFirstMeet
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
 * @apiSuccess {Object}                                                                       response.items.customer
 * @apiSuccess {String}                                                                       response.items.customer.id
 * @apiSuccess {String}                                                                       response.items.customer.name
 * @apiSuccess {String}                                                                       response.items.customer.surname
 * @apiSuccess {String}                                                                       response.items.customer.phoneNumber
 * @apiSuccess {String}                                                                      [response.items.customer.imageUrl]
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
 * @apiGroup Employee confirmed orders
 * @api {get} /employee/confirmed/:orderId Get confirmed order details
 * @apiName getConfirmedOrderDetails
 *
 * @apiHeader Content-Type (application/json)
 * @apiHeader {String="Bearer :token"} Authorization Replace <code>:token</code> with supplied Auth Token
 *
 * @apiParam (Params) {String}                                                                orderId
 *
 *
 * @apiSuccess {Object}                                                                       response
 * @apiSuccess {String}                                                                       response.id
 * @apiSuccess {String="confirmed", "pending", "canceled", "in-progress", "completed"}        response.status
 * @apiSuccess {Number}                                                                       response.dateFrom
 * @apiSuccess {Number}                                                                       response.dateTo
 * @apiSuccess {String}                                                                       response.customerId
 * @apiSuccess {String}                                                                      [response.comment]
 * @apiSuccess {Number}                                                                       response.totalAmount
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